import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRefreshTokenRepository } from '../../domain/auth/refresh-token.repository.interface';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { AuthResult } from '../../domain/auth/auth-result.interface';
import { JwtPayload } from '../../domain/auth/jwt-payload.interface';
import { GenerateTokenUseCase } from './generate-token.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly generateTokenUseCase: GenerateTokenUseCase,
  ) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    // Find refresh token
    const token = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // Check if token is expired or revoked
    if (token.isExpired() || token.isRevoked) {
      throw new UnauthorizedException('만료되거나 폐기된 리프레시 토큰입니다.');
    }

    // Find user
    const user = await this.userRepository.findById(token.userId.toHexString());
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    // Revoke current refresh token
    token.revoke();
    await this.refreshTokenRepository.save(token);

    // Generate new tokens
    return this.generateTokenUseCase.execute(user);
  }
}