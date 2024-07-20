import { Response } from "express";

const NotFoundData = (res: Response) => {
  return res.status(404).json({
    code: 404,
    error: "Not Found",
    message: "Requested resource not found",
  });
};

export default {
  NotFoundData,
};
