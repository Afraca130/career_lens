import { Injectable, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Types } from 'mongoose';
import * as crypto from 'crypto';
import { User } from "../../domain/user/entity/user.entity";
import { AuthResult } from "../../domain/auth/auth-result.interface";
import { JwtPayload } from "../../domain/auth/jwt-payload.interface";
import { RefreshToken } from '../../domain/auth/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/auth/refresh-token.repository.interface';

@Injectable()
export class GenerateTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(user: User): Promise<AuthResult> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    // Generate access token (24 hours)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });

    // Generate refresh token (30 days)
    const refreshTokenString = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const refreshToken = new RefreshToken(
      refreshTokenString,
      new Types.ObjectId(user.id),
      expiresAt,
    );

    // Clean up old refresh tokens for this user
    await this.refreshTokenRepository.deleteByUserId(user.id);

    // Save new refresh token
    await this.refreshTokenRepository.create(refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshTokenString,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
