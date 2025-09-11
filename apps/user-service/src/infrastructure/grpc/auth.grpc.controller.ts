import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { AuthMicroservice } from "@app/common";
import { SignupRequest } from "../../application/use-cases/auth/dto/signup.request";
import { AuthApplicationService } from "../../application/services/auth.application.service";
import { LoginRequest } from "../../application/use-cases/auth/dto/login.request";
import { RefreshTokenRequest } from "../../application/use-cases/auth/dto/refresh-token.request";

@Controller()
export class AuthGrpcController {
  constructor(
    private readonly authApplicationService: AuthApplicationService
  ) {}

  @GrpcMethod("AuthService", "Signup")
  async signup(data: AuthMicroservice.SignupRequest) {
    const request = new SignupRequest(
      data.name,
      data.email,
      data.password,
      data.signType
    );
    const result = await this.authApplicationService.signup(request);

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      signType: result.signType,
      isVerified: result.isVerified,
      createdAt: result.createdAt.toISOString(),
    };
  }

  @GrpcMethod("AuthService", "Login")
  async login(data: AuthMicroservice.LoginRequest) {
    const request = new LoginRequest(data.email, data.password);
    const result = await this.authApplicationService.login(request);

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    };
  }

  @GrpcMethod("AuthService", "VerifyToken")
  async verifyToken(data: AuthMicroservice.VerifyTokenRequest) {
    const result = await this.authApplicationService.verifyToken(data.token);
    return result;
  }

  @GrpcMethod("AuthService", "RefreshToken")
  async refreshToken(data: AuthMicroservice.RefreshTokenRequest) {
    const request = new RefreshTokenRequest(data.refreshToken);
    const result = await this.authApplicationService.refreshToken(request);

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    };
  }
}
