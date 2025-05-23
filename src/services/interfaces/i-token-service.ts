import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): { id: string };
  verifyRefreshToken(token: string): { id: string };
}
