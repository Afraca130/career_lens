import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { IAuthService } from "../../../domain/auth/auth.service.interface";
import { LoginRequest } from "./login.request";
import { LoginResponse } from "./login.response";
import { InvalidCredentialsException } from "../../../domain/auth/exceptions";

/**
 * 로그인 유스케이스
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // 1. 사용자 조회
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await this.authService.comparePassword(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // 3. JWT 토큰 생성
    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      type: "access",
    });

    // 4. 응답 생성
    return new LoginResponse(
      token,
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    );
  }
}
