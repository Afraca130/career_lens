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
    const accessToken = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      type: "access",
    });

    const refreshToken = this.authService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      type: "refresh",
    });

    // 4. Refresh Token을 데이터베이스에 저장
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    // 5. 응답 생성
    return new LoginResponse(
      accessToken,
      refreshToken,
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    );
  }
}
