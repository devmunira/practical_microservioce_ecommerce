import { userCreateSchema } from "@/schema";
import { Request, Response, NextFunction } from "express";
import { UserServices } from "@/services/user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = userCreateSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }
    const data = await new UserServices().createUser(parseBody?.data);

    return res.status(201).json({
      code: 201,
      message: "User Created!",
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default createUser;
