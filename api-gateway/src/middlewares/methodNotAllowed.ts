import { NextFunction, Request, Response } from "express";

const methodNotAllowed = (method: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLowerCase() !== method.toLowerCase()) {
      return res.status(405).json({
        code: 405,
        error: "Method Not Allowed",
        message: "You are hiting on a invalid method",
      });
    }

    next();
  };
};

export default methodNotAllowed;
