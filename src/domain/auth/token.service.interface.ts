export interface ITokenService {
  verifyRefreshToken(token: string): Promise<{ userId: string; email: string }>;
  generateAccessToken(userId: string, email: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
}

export const ITokenService = Symbol("ITokenService");
