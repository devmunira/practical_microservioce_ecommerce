import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { Response, Request } from "express";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { errorHandler, methodNotAllowed } from "./middlewares";
import { originGuard } from "./middlewares/originGuard";
const swaggerDocs = YAML.load("docs/swagger.yaml");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", methodNotAllowed("get"), (_req: Request, res: Response) => {
  res.status(200).json({ code: 200, message: "Server health is okay" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", router);

// Not Found Handler
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    error: "Not Found",
    message: "Requested resource not found",
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4003;
const serviceName = process.env.SERVICE_NAME || "auth-service";

// Server Running
app.listen(PORT, () => {
  console.log(`${serviceName} is running on port ${PORT}`);
});
