import { UserServices } from "@/services/user.services";
import { NextFunction, Request, Response } from "express";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const data = await new UserServices().getUserById(userId);
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get user details by Id:" + error);
    next(error);
  }
};

export default getUserById;
