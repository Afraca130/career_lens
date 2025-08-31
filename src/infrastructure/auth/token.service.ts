import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenService } from "../../domain/auth/token.service.interface";

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyRefreshToken(
    token: string
  ): Promise<{ userId: string; email: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      });

      return {
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email: email,
      type: "access",
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || "access-secret",
      expiresIn: "24h",
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: "refresh",
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      expiresIn: "30d",
    });
  }
}
