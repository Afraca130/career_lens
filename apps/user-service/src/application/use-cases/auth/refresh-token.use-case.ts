import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { IAuthService } from "../../../domain/auth/auth.service.interface";
import { RefreshTokenRequest } from "./dto/refresh-token.request";
import { RefreshTokenResponse } from "./dto/refresh-token.response";
import { InvalidTokenException } from "../../../domain/auth/exceptions";

/**
 * Refresh Token 유스케이스
 * Refresh Token을 사용하여 새로운 Access Token을 발급
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IAuthService")
    private readonly authService: IAuthService
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      // 1. Refresh Token 검증
      const payload = this.authService.verifyToken(request.refresh_token);

      // 2. 사용자 조회
      const user = await this.userRepository.findByRefreshToken(
        request.refresh_token
      );
      if (!user) {
        throw new InvalidTokenException("Invalid refresh token");
      }

      // 3. 새로운 Access Token 생성
      const newAccessToken = this.authService.generateToken({
        userId: user.id,
        email: user.email,
        type: "access",
      });

      // 4. 새로운 Refresh Token 생성
      const newRefreshToken = this.authService.generateRefreshToken({
        userId: user.id,
        email: user.email,
        type: "refresh",
      });

      // 5. 새로운 Refresh Token을 데이터베이스에 저장
      await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

      // 6. 응답 생성
      return new RefreshTokenResponse(newAccessToken, newRefreshToken);
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw error;
      }
      throw new InvalidTokenException("Invalid refresh token");
    }
  }
}
