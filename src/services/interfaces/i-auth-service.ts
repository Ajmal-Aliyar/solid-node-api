import { AuthResponse, LoginDto, RegisterDto } from "@/dtos/auth-dtos";
import { IUser } from "@/models";

export interface IAuthService {
    register(data: RegisterDto): Promise<void>;
    login(data: LoginDto): Promise<AuthResponse>;
    logout(userId: string): Promise<void>;
    refreshToken(token: string): Promise<AuthResponse>;
    verifyOtpAndRegister(email: string, otp: string): Promise<AuthResponse>;
    getProfile(userId: string): Promise<IUser>;
}