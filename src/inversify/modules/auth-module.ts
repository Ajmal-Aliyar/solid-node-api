import { Container } from "inversify";
import TYPES from "../types";
import { AuthService } from "@/services/implementations/auth-service";
import { AuthController } from "@/controllers/implementations/auth-controller";
import { IAuthService } from "@/services/interfaces/i-auth-service";
import { IAuthController } from "@/controllers/interfaces/i-auth-controller";

export const bindAuthModule = async (container: Container) => {
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
}