import { NextFunction, Request, Response } from "express";

const originChecker = (origin: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!origin.includes(req.headers.origin || "")) {
      return res.status(405).json({
        code: 405,
        error: "Access Denied",
        message: "Forbidden Resources",
      });
    }
    next();
  };
};

export default originChecker;
