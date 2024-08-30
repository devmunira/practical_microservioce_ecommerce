import { CustomError } from "@/utils";
import { Prisma } from "@prisma/client";
import z, { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      code: err.code || 400,
      message: "Bad Request!",
      errors: err.meta,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      code: 400,
      message: "Validation Error",
      errors: err.errors.map((error) => ({
        path: error.path,
        message: error.message,
      })),
    });
  }

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
