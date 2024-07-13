import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { errorHandler } from "./middlewares";
import { customHandler } from "./library/customHandler";
const swaggerDocs = YAML.load("docs/swagger.yaml");

dotenv.config();
const app = express();
const SERVICE_NAME = process.env.SERVICE_NAME || "api-gateway-service";
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    message: `${SERVICE_NAME} is okay!`,
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  handler: (_req, res) => {
    res.status(429).json({
      code: 429,
      message: "Too many requests, please try again later",
    });
  },
});

app.use("/api", rateLimiter);
customHandler(app);

app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    error: "Not Found",
    message: "Requested resource not found",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} is running on port ${PORT}`);
});
