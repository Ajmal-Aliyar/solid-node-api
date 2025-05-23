import { inject, injectable } from "inversify";
import TYPES from "@/inversify/types";
import { RegisterDto, LoginDto, AuthResponse } from "@/dtos/auth-dtos";
import { IUser } from "@/models";
import { IAuthService } from "@/services/interfaces/i-auth-service";
import { IUserRepository } from "@/repositories/interface/i-user-repository";
import { IEmailService } from "@/services/interfaces/i-email-service";
import { IPasswordHasher } from "@/services/interfaces/i-password-service";
import { IOtpService } from "@/services/interfaces/i-otp-service";
import { ICacheService } from "@/services/interfaces/i-cache-service";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors/custom-errors";
import { ERROR_MESSAGES } from "@/constants/messages";
import { ITokenService } from "@/services/interfaces/i-token-service";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TYPES.TokenService) private readonly tokenService: ITokenService,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService,
    @inject(TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @inject(TYPES.OtpService) private readonly otpService: IOtpService,
    @inject(TYPES.CacheService) private readonly cacheService: ICacheService
  ) {}

  async register(data: RegisterDto): Promise<void> {
    const existing = await this.userRepo.findUserByEmail(data.email);
    if (existing) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
    const hashedPassword = await this.passwordHasher.hash(data.password);

    const otp = this.otpService.generateOtp();
    console.log(otp);
    await this.otpService.storeOtp(data.email, otp);

    await this.cacheService.set(
      data.email,
      JSON.stringify({
        ...data,
        password: hashedPassword,
        otp,
      }),
      900
    );

    await this.emailService.sendOtpEmail(data.email, otp);
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.passwordHasher.compare(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = this.tokenService.generateAccessToken({ id: user.id });
    const refreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
    });
    await this.cacheService.set(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }



  async refreshToken(token: string): Promise<AuthResponse> {
    const payload = this.tokenService.verifyRefreshToken(token);

    if (typeof payload === "string" || !payload.id) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const userId = payload.id;

    const validToken = await this.cacheService.get(userId);
    if (!validToken || token !== validToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const accessToken = this.tokenService.generateAccessToken({ id: user.id });
    const newRefreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
    });
    await this.cacheService.set(user.id, newRefreshToken);

    return { user, accessToken, refreshToken: newRefreshToken };
  }



  async verifyOtpAndRegister(
    email: string,
    otp: string
  ): Promise<AuthResponse> {
    const isValidOtp = await this.otpService.verifyOtp(email, otp);
    if (!isValidOtp) {
      throw new UnauthorizedError(ERROR_MESSAGES.OTP_INVALID_OR_EXPIRED);
    }

    const cachedDataString = await this.cacheService.get(email);
    if (!cachedDataString) {
      throw new BadRequestError(ERROR_MESSAGES.NO_REGISTRATION_DATA);
    }

    let cachedData;
    try {
      cachedData = JSON.parse(cachedDataString);
    } catch {
      throw new BadRequestError(ERROR_MESSAGES.CORRUPTED_CACHE_DATA);
    }

    const existingUser = await this.userRepo.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const createdUser = await this.userRepo.create({
      fullName: cachedData.fullName,
      email: cachedData.email,
      password: cachedData.password,
    });

    await this.otpService.deleteOtp(email);
    await this.cacheService.del(email);

    const accessToken = this.tokenService.generateAccessToken({
      id: createdUser.id,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      id: createdUser.id,
    });
    await this.cacheService.set(createdUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: createdUser,
    };
  }



  async logout(userId: string): Promise<void> {
    await this.cacheService.del(userId);
  }


  
  async getProfile(userId: string): Promise<IUser> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }
}
