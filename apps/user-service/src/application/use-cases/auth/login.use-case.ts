import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { AuthService } from "../../../domain/auth/auth.service";
import { LoginRequest } from "./dto/login.request";
import { LoginResponse } from "./dto/login.response";
import { InvalidCredentialsException } from "../../../domain/auth/exceptions";

/**
 * 로그인 유스케이스
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService
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

    // 4. Refresh Token 생성
    const refreshToken = this.authService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      type: "refresh",
    });

    // 5. Refresh Token을 데이터베이스에 저장
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    // 6. 응답 생성
    return new LoginResponse(accessToken, refreshToken, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}
