import { registerSchema } from "@/schema";
import { authService } from "@/services/auth.services";
import { NextFunction, Request, Response } from "express";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = registerSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    const data = await new authService().register(parseBody.data);

    // return updated data
    return res.status(201).json({
      code: 201,
      message:
        "Registration Completed, please check your mail box for verify your account",
      data,
    });
  } catch (error) {
    console.log("Error logs while delete user for-", error);
    next(error);
  }
};

export default register;
