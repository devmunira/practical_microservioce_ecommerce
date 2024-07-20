import { loginSchema } from "@/schema";
import { authService } from "@/services/auth.services";
import { Request, Response, NextFunction } from "express";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = loginSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }
    const data = await new authService().login(req, parseBody?.data);

    return res.status(200).json({
      code: 200,
      message: "User Created!",
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default login;
