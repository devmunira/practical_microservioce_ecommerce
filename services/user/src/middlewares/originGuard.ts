import { ForbiddenResourceError } from "@/utils/customError";
import { NextFunction, Request, Response } from "express";

export const originGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const acceptedOrigin = ["http://localhost:4000"];
  const origin = req.headers.origin || "";
  if (!acceptedOrigin.includes(origin)) {
    throw new ForbiddenResourceError(
      "Forbidden Resources - Origin Not Allowed!"
    );
  } else {
    next();
  }
};
