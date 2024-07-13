import { userUpdateSchema } from "@/schema";
import { UserServices } from "@/services/user.services";
import { NextFunction, Request, Response } from "express";

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check User is exists
    const { userId } = req.params;

    // validate request data
    const parseBody = userUpdateSchema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    const data = await new UserServices().updateUser(userId, parseBody.data);

    // return updated data
    return res.status(203).json({
      code: 204,
      message: "User Updated",
      data,
    });
  } catch (error) {
    console.log("Error logs while update User for-", error);
    next(error);
  }
};

export default updateUser;
