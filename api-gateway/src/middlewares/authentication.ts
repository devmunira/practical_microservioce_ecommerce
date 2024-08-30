import { AUTH_URL, ORIGIN } from "@/connfiguration";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders) {
    return res.status(4001).json({
      code: 401,
      message: "Unauthentic",
    });
  }
  try {
    const accessToken = authHeaders.split(" ")[1];

    const { data } = await axios({
      method: "post",
      url: `${AUTH_URL}/auth/checkpoint`,
      data: {
        token: accessToken,
      },
      headers: {
        origin: ORIGIN,
        ip: req.ip,
        "user-agent": req.headers["user-agent"],
      },
    });

    req.headers["x-user-id"] = data.user.id;
    req.headers["x-user-email"] = data.user.email;
    req.headers["x-user-name"] = data.user.name;
    req.headers["x-user-role"] = data.user.role;
    req.headers["x-cart-session-id"] = req.headers["x-cart-session-id"] || "";

    next();
  } catch (error) {
    console.log(`[Auth Middleware] - ${error}`);
    next(error);
  }
};
