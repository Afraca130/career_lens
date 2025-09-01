import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { IAuthService } from "../../domain/auth/auth.service.interface";
import { User } from "../../domain/user/entity/user.entity";
import { SignupRequest, LoginRequest, LoginResponse } from "./interfaces";

@Injectable()
export class AuthContext {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async signup(request: SignupRequest): Promise<User> {
    // 이메일 중복 검증
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // 비밀번호 암호화
    const hashedPassword = await this.authService.hashPassword(
      request.password
    );

    // 사용자 생성 (인증 정보 포함)
    const user = await this.userRepository.create({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      signType: request.signType || "email",
      role: "user",
    });

    return user;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    // 이메일 존재 여부 확인
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error("User not found");
    }

    // 비밀번호 검증
    const isPasswordValid = await this.authService.comparePassword(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // JWT 토큰 생성
    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      type: "access",
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      // JWT 토큰에서 Bearer 제거
      const cleanToken = token.replace("Bearer ", "");

      if (!cleanToken) {
        throw new Error("Token is required");
      }

      // 토큰 검증
      const payload = this.authService.verifyToken(cleanToken);

      return payload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
