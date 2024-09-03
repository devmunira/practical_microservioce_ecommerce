import { ForbiddenResourceError } from "@/utils/customError";
import { NextFunction, Request, Response } from "express";

export const originGuard = (origins: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptedOrigin = [
      process.env.ORIGIN_URL || "http://localhost:4000",
      ...origins,
    ];
    const origin = req.headers.origin || "";
    if (!acceptedOrigin.includes(origin)) {
      console.log("Forbidden Resources - Origin Not Allowed!");
      throw new ForbiddenResourceError(
        "Forbidden Resources - Origin Not Allowed!"
      );
    } else {
      next();
    }
  };
};
