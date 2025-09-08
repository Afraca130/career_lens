import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthApplicationService } from "../application/services/auth.application.service";
import { SignupRequest } from "../application/use-cases/auth/signup.request";
import { LoginRequest } from "../application/use-cases/auth/login.request";
import { RefreshTokenRequest } from "../application/use-cases/auth/refresh-token.request";
import { ChangePasswordRequest } from "../application/use-cases/user/change-password.request";

/**
 * gRPC 인증 컨트롤러
 * 다른 마이크로서비스와의 gRPC 통신을 담당
 */
@Controller()
export class AuthGrpcController {
  constructor(private readonly authApplicationService: AuthApplicationService) {}

  @GrpcMethod("AuthService", "Signup")
  async signup(data: any) {
    const request = new SignupRequest(
      data.name,
      data.email,
      data.password,
      data.sign_type
    );
    
    const result = await this.authApplicationService.signup(request);
    
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      sign_type: result.signType,
      is_verified: result.isVerified,
      created_at: result.createdAt.toISOString(),
    };
  }

  @GrpcMethod("AuthService", "Login")
  async login(data: any) {
    const request = new LoginRequest(data.email, data.password);
    const result = await this.authApplicationService.login(request);
    
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    };
  }

  @GrpcMethod("AuthService", "VerifyToken")
  async verifyToken(data: any) {
    const result = await this.authApplicationService.verifyToken(data.token);
    
    return {
      user_id: result.userId,
      email: result.email,
      type: result.type,
      iat: result.iat,
      exp: result.exp,
    };
  }

  @GrpcMethod("AuthService", "GetUser")
  async getUser(data: any) {
    const result = await this.authApplicationService.getUser(data.user_id);
    
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      sign_type: result.signType,
      is_verified: result.isVerified,
      is_deleted: result.isDeleted,
      created_at: result.createdAt.toISOString(),
      updated_at: result.updatedAt.toISOString(),
    };
  }

  @GrpcMethod("AuthService", "ChangePassword")
  async changePassword(data: any) {
    const request = new ChangePasswordRequest(data.user_id, data.new_password);
    const result = await this.authApplicationService.changePassword(request);
    
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      sign_type: result.signType,
      is_verified: result.isVerified,
      is_deleted: result.isDeleted,
      created_at: result.createdAt.toISOString(),
      updated_at: result.updatedAt.toISOString(),
    };
  }

  @GrpcMethod("AuthService", "RefreshToken")
  async refreshToken(data: any) {
    const request = new RefreshTokenRequest(data.refresh_token);
    const result = await this.authApplicationService.refreshToken(request);
    
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }
}
