import { Router } from "express";
import TYPES from "@/inversify/types";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
} from "@/validators/auth-validators";
import { validateRequest } from "@/middlewares/validate-requests";
import { Container } from "inversify";
import { IAuthController } from "@/controllers/interfaces/i-auth-controller";
import { authenticateAccessToken } from "@/middlewares/authenticateAccessToken";

export const createAuthRouter = (container: Container): Router => {
  const router = Router();
  const authController = container.get<IAuthController>(TYPES.AuthController);

  router.post("/register", validateRequest(registerSchema), (req, res, next) =>
    authController.register(req, res, next)
  );

  router.post("/login", validateRequest(loginSchema), (req, res, next) =>
    authController.login(req, res, next)
  );

  router.post(
    "/verify-otp",
    validateRequest(verifyOtpSchema),
    (req, res, next) => authController.verifyOtpAndRegister(req, res, next)
  );

  router.post("/refresh-token", (req, res, next) =>
    authController.refreshToken(req, res, next)
  );

  router.post("/logout", authenticateAccessToken, (req, res, next) =>
    authController.logout(req, res, next)
  );

  router.get("/me", authenticateAccessToken, (req, res, next) =>
    authController.me(req, res, next)
  );

  return router;
};
