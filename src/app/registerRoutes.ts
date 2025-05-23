import { getContainer } from "@/inversify/container";
import { createAuthRouter } from "@/routes/auth-route";
import { Express } from "express";

export const registerRoutes = (app: Express) => {
  const container = getContainer();
  app.use("/api/auth", createAuthRouter(container));
};
