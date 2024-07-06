import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares";
import rateLimit from "express-rate-limit";
import { customHandler } from "./library/customHandler";

const app = express();
dotenv.config();
app.use([cors(), express.json(), morgan("dev"), helmet()]);

const SERVICE_NAME = process.env.SERVICE_NAME || "api-gateway-service";
const PORT = process.env.PORT || 4000;

app.get("/health", (_req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    code: 200,
    message: `${SERVICE_NAME} is okay!`,
  });
});

// rate limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins rate limit
  max: 100,
  handler: (_req, res) => {
    res.status(429).json({
      code: 429,
      message: "Too many request, please try again later",
    });
  },
});

// All Routes
app.use("/api", rateLimiter);
customHandler(app);

// Not found handler
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    error: "Not Found",
    message: "Requested resource not found",
  });
});

// Error Handler
app.use(errorHandler);

// Server Running
app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} is running on port ${PORT}`);
});
