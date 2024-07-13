import { UserServices } from "@/services/user.services";
import { NextFunction, Request, Response } from "express";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await new UserServices().getUsers();
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

export default getUsers;
