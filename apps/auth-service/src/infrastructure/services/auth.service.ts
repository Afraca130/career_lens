import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { IAuthService } from "../../domain/auth/auth.service.interface";

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
      expiresIn: "30m", // Access Token: 30분
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "15d", // Refresh Token: 15일
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
