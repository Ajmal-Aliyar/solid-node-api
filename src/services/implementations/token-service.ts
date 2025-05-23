import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { env } from "@/config/env.config";
import { ITokenService } from "../interfaces/i-token-service";

@injectable()
export class TokenService implements ITokenService {
  private accessTokenSecret = env.ACCESS_TOKEN_SECRET;
  private refreshTokenSecret = env.REFRESH_TOKEN_SECRET;

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string):{ id: string } {
    return jwt.verify(token, this.accessTokenSecret) as { id: string } ;
  }

  verifyRefreshToken(token: string): { id: string } {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string }
  }
}
