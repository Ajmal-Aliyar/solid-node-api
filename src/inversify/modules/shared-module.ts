import { CacheService } from "@/services/implementations/cache-service";
import { ICacheService } from "@/services/interfaces/i-cache-service";
import { Container } from "inversify";
import TYPES from "../types";
import { IEmailService } from "@/services/interfaces/i-email-service";
import { IOtpService } from "@/services/interfaces/i-otp-service";
import { IPasswordHasher } from "@/services/interfaces/i-password-service";
import { ITokenService } from "@/services/interfaces/i-token-service";
import { RedisClientType } from "redis";
import { getRedisClient } from "@/config/redis.config";
import { createTransporter } from "@/config/email.config";
import nodemailer from "nodemailer"
import { EmailService } from "@/services/implementations/email-service";
import { OtpService } from "@/services/implementations/otp-service";
import { PasswordHasher } from "@/services/implementations/password-hasher";
import { TokenService } from "@/services/implementations/token-service";

export const bindSharedModule = async (container: Container) => {
 container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
  container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
  container.bind<IOtpService>(TYPES.OtpService).to(OtpService);
  container.bind<IPasswordHasher>(TYPES.PasswordHasher).to(PasswordHasher);
  container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
  container
    .bind<RedisClientType>(TYPES.RedisClient)
    .toConstantValue(getRedisClient());
  container
    .bind<nodemailer.Transporter>(TYPES.EmailTransporter)
    .toConstantValue(createTransporter());
}