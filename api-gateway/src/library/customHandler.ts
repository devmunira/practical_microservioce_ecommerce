import { handlerParamsDto } from "@/types/handler";
import axios from "axios";
import apis from "config.json";
import { Express, Request, Response } from "express";
import colors from "colors";
import { handleMiddlewares } from "./handleMiddlewares";

export const Handler = (handlerParams: handlerParamsDto) => {
  const { hostname, path, method } = handlerParams;
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostname}${path}`;
      req.params &&
        Object.keys(req.params).forEach((param) => {
          url = url.replace(`:${param}`, req.params[param]);
        });

      console.log(colors.yellow(`Forwarding request to: ${url}`));
      console.log(colors.yellow(`Method: ${method}`));
      console.log(colors.yellow(`Request body: ${JSON.stringify(req.body)}`));

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          ...req.headers,
          origin: process.env.ORIGIN || "http://localhost:4000",
        },
      });

      res.json(data);
    } catch (error: any) {
      console.log(colors.red(error?.response?.data || error.response));
      if (error instanceof axios.AxiosError) {
        return res.status(error.response?.status || 400).json({
          code: error.response?.status || 400,
          message: error.message || "Axios Error",
          errors: error?.response?.data,
        });
      }
      return res.status(500).json({
        code: 500,
        errors: error,
      });
    }
  };
};

export const customHandler = (app: Express) => {
  Object.entries(apis.services).forEach(([name, service]) => {
    const hostname = service?.url;
    service?.routes?.forEach((route) => {
      route?.methods?.forEach((method) => {
        const middlewares = handleMiddlewares(route.middlewares);
        app[method](
          `/api${route?.path}`,
          middlewares,
          Handler({ hostname, path: route.path, method })
        );
      });
    });
  });
};
