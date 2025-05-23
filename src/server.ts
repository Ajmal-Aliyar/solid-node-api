import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { requestLogger } from "@/middlewares/request-logger";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());
  return app;
};
