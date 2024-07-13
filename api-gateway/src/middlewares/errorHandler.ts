import { CustomError } from "@/utils";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    code: 500,
    error: err,
    message: "Server Not Responding! Try again later.",
  });
};

export default errorHandler;
