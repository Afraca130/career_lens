import { Injectable } from "@nestjs/common";
import { SignupUseCase } from "../use-cases/auth/signup.use-case";
import { LoginUseCase } from "../use-cases/auth/login.use-case";
import { VerifyTokenUseCase } from "../use-cases/auth/verify-token.use-case";
import { RefreshTokenUseCase } from "../use-cases/auth/refresh-token.use-case";
import { GetUserUseCase } from "../use-cases/user/get-user.use-case";
import { ChangePasswordUseCase } from "../use-cases/user/change-password.use-case";
import { SignupRequest } from "../use-cases/auth/signup.request";
import { LoginRequest } from "../use-cases/auth/login.request";
import { RefreshTokenRequest } from "../use-cases/auth/refresh-token.request";
import { ChangePasswordRequest } from "../use-cases/user/change-password.request";
import { SignupResponse } from "../use-cases/auth/signup.response";
import { LoginResponse } from "../use-cases/auth/login.response";
import { RefreshTokenResponse } from "../use-cases/auth/refresh-token.response";
import { User } from "../../domain/user/entity/user.domain";

/**
 * 인증 애플리케이션 서비스
 * 유스케이스들을 조합하여 애플리케이션 레벨의 비즈니스 로직을 처리
 */
@Injectable()
export class AuthApplicationService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase
  ) {}

  async signup(request: SignupRequest): Promise<SignupResponse> {
    return this.signupUseCase.execute(request);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.loginUseCase.execute(request);
  }

  async verifyToken(token: string): Promise<any> {
    return this.verifyTokenUseCase.execute(token);
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.refreshTokenUseCase.execute(request);
  }

  async getUser(userId: string): Promise<User> {
    return this.getUserUseCase.execute(userId);
  }

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    return this.changePasswordUseCase.execute(request);
  }
}
