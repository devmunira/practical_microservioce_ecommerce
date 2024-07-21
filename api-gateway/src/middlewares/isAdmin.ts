import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const roleHeaders = req.headers["x-user-role"];
  if (!roleHeaders) {
    return res.status(403).json({
      code: 403,
      message: "Forbidden",
    });
  }

  if (roleHeaders === "ADMIN") {
    next();
  }
};
