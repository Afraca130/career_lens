import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { IAuthService } from "./auth.service.interface";

/**
 * 인증 도메인 서비스
 * 인증 관련 비즈니스 로직을 구현
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "24h",
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "7d",
    });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
