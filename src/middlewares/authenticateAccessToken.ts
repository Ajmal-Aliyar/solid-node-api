import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/errors/custom-errors";
import { TokenService } from "@/services/implementations/token-service";
import TYPES from "@/inversify/types";
import { getContainer } from "@/inversify/container";
import { ERROR_MESSAGES } from "@/constants/messages";

export const authenticateAccessToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const container = getContainer();
    const token = req.cookies?.accessToken;
  
    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.ACCESS_TOKEN_MISSING);
    }

    const tokenService = container.get<TokenService>(TYPES.TokenService);

    const { id } = tokenService.verifyAccessToken(token);

    req.user = {
      id,
    };

    next();
  } catch (error) {
    next(error)
  }
};
