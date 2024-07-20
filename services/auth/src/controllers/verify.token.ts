import { Response, Request } from "express";
import prisma from "@/config/db";
import { tokenSchema, verifyCodeSchema } from "@/schema";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authService } from "@/services/auth.services";

export const checkpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = tokenSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { token } = parsedBody.data;
    const decoded = jwt.verify(token, (process.env.JWT as string) || "!@$%^&");

    const user = await prisma.auth.findUnique({
      where: { id: (decoded as any).userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    return res.status(200).json({ code: 200, message: "Authorized", user });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = verifyCodeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const data = await new authService().verifyCode(parsedBody.data);

    return res
      .status(200)
      .json({ code: 200, message: "Verification Completed", data });
  } catch (error) {
    next(error);
  }
};
