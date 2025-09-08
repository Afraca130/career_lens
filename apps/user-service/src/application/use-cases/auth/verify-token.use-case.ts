import { Injectable } from "@nestjs/common";
import { IAuthService } from "../../../domain/auth/auth.service.interface";
import { InvalidTokenException } from "../../../domain/auth/exceptions";

/**
 * 토큰 검증 유스케이스
 */
@Injectable()
export class VerifyTokenUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(token: string): Promise<any> {
    try {
      // JWT 토큰에서 Bearer 제거
      const cleanToken = token.replace("Bearer ", "");

      if (!cleanToken) {
        throw new InvalidTokenException("Token is required");
      }

      // 토큰 검증
      const payload = this.authService.verifyToken(cleanToken);

      return payload;
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw error;
      }
      throw new InvalidTokenException();
    }
  }
}
