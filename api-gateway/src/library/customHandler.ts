import { handlerParamsDto } from "@/types/handler";
import axios from "axios";
import apis from "config.json";
import { Express, Request, Response } from "express";

export const Handler = (handlerParams: handlerParamsDto) => {
  const { hostname, path, method } = handlerParams;

  return async (req: Request, res: Response) => {
    let url = `${hostname}${path}`;
    req.params &&
      Object.keys(req.params).forEach((param) => {
        url = url.replace(`:${param}`, param);
      });

    const data = await axios({
      method,
      url,
      data: req.body,
      headers: {
        ...req.headers,
        origin: process.env.ORIGIN || "http://localhost:4000",
      },
    });
    res.json(data);
  };
};

export const customHandler = (app: Express) => {
  Object.entries(apis.services).forEach(([name, service]) => {
    const hostname = service?.url;
    service?.routes?.forEach((route) => {
      route?.methods?.forEach((method) => {
        app[method](
          `/api${route?.path}`,
          Handler({ hostname, path: route.path, method })
        );
      });
    });
  });
};
