import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { Response, Request, ErrorRequestHandler } from "express";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server health is Okay!" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found!" });
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || "inventory-service";

app.listen(PORT, () => {
  console.log(`${serviceName} is running on port ${PORT}`);
});
