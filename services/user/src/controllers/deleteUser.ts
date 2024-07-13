import { UserServices } from "@/services/user.services";
import { NextFunction, Request, Response } from "express";

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check User is exists
    const { userId } = req.params;

    await new UserServices().deleteUser(userId);

    // return updated data
    return res.status(204).json({
      code: 204,
      message: "User has been deleted with User Associated data",
    });
  } catch (error) {
    console.log("Error logs while delete user for-", error);
    next(error);
  }
};

export default deleteUser;
