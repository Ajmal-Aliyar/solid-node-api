import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants/messages";

export const registerSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  password: z
    .string({ required_error: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
  fullName: z
    .string({ required_error: VALIDATION_MESSAGES.FULL_NAME_REQUIRED })
    .min(3, { message: VALIDATION_MESSAGES.FULL_NAME_MIN })
    .max(30, { message: VALIDATION_MESSAGES.FULL_NAME_MAX }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  password: z
    .string({ required_error: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  otp: z
    .string({ required_error: VALIDATION_MESSAGES.OTP_REQUIRED })
    .min(6, { message: VALIDATION_MESSAGES.OTP_MIN }),
});
