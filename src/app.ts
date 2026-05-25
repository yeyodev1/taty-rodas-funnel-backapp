import express from "express";
import cors from "cors";
import http from "http";
import { HttpStatusCode } from "axios";
import routerApi from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";

const ALLOWED_ORIGINS = [
  "http://localhost:8100",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8101",
  "https://testing-storybrand-frontend.bakano.ec",
  "https://tatianarodascoach.com",
  "https://funnel-taty-rodas.netlify.app"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    callback(null, !origin || ALLOWED_ORIGINS.includes(origin));
  },
  credentials: true,
};

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));

  app.get("/", (_req, res) => {
    res.status(HttpStatusCode.Ok).send({
      message: "Taty Rodas Funnel API is running successfully."
    });
    return;
  });

  routerApi(app);

  app.use(globalErrorHandler);

  const server = http.createServer(app);

  return { app, server };
}
