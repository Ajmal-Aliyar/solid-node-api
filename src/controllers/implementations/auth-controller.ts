import TYPES from "@/inversify/types";
import { inject, injectable } from "inversify";
import { IAuthController } from "@/controllers/interfaces/i-auth-controller";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/errors/custom-errors";
import { successResponse } from "@/utils/api-response";
import { HTTP_STATUS } from "@/constants/http-status";
import { IAuthService } from "@/services/interfaces/i-auth-service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
      }

      const { user, accessToken, refreshToken } = await this.authService.login({
        email,
        password,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESSFUL, user);
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, fullName } = req.body;

      await this.authService.register({
        email,
        password,
        fullName,
      });

      successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.REGISTRATION_INITIATED);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtpAndRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken, user } =
        await this.authService.verifyOtpAndRegister(email, otp);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      successResponse(res, HTTP_STATUS.OK,  SUCCESS_MESSAGES.USER_REGISTERED_AND_AUTHORIZED, user);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.refreshToken;

      const { user, accessToken, refreshToken } =
        await this.authService.refreshToken(token);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.TOKEN_REFRESHED, user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);
      }

      await this.authService.logout(userId);

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);
      }

      const user = await this.authService.getProfile(userId);

      successResponse(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_FETCHED,
        user
      );
    } catch (error) {
      next(error);
    }
  }
}
