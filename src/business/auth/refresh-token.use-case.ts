import { Injectable, Inject } from "@nestjs/common";
import { RefreshTokenPort } from "../../domain/auth/refresh-token.port";
import { RefreshTokenCommand } from "../../domain/auth/refresh-token.command";
import { RefreshTokenResult } from "../../domain/auth/refresh-token-result.interface";
import { IRefreshTokenRepository } from "../../domain/auth/refresh-token.repository.interface";
import { IUserRepository } from "../../domain/auth/user.repository.interface";
import { ITokenService } from "../../domain/auth/token.service.interface";
import {
  InvalidRefreshTokenException,
  ExpiredRefreshTokenException,
  RevokedRefreshTokenException,
  UserNotFoundException,
} from "../../domain/auth/refresh-token.exception";
import { RefreshToken } from "../../domain/auth/entity/refresh-token.entity";

@Injectable()
export class RefreshTokenUseCase implements RefreshTokenPort {
  constructor(
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ITokenService)
    private readonly tokenService: ITokenService
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    // 1. Verify refresh token and extract user information
    const tokenPayload = await this.verifyRefreshToken(command.refreshToken);

    // 2. Find refresh token in database
    const refreshTokenEntity = await this.findRefreshToken(
      command.refreshToken
    );

    // 3. Validate refresh token status
    this.validateRefreshToken(refreshTokenEntity);

    // 4. Find user
    const user = await this.findUser(tokenPayload.userId);

    // 5. Generate new access token and refresh token
    const newAccessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.email
    );
    const newRefreshToken = await this.tokenService.generateRefreshToken(
      user.id
    );

    // 6. Save new refresh token and revoke old one
    await this.saveNewRefreshToken(newRefreshToken, user.id);
    await this.revokeOldRefreshToken(refreshTokenEntity);

    // 7. Return new tokens and user information
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async verifyRefreshToken(
    refreshToken: string
  ): Promise<{ userId: string; email: string }> {
    try {
      return await this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new InvalidRefreshTokenException("Invalid refresh token format");
    }
  }

  private async findRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);
    if (!refreshToken) {
      throw new InvalidRefreshTokenException("Refresh token not found");
    }
    return refreshToken;
  }

  private validateRefreshToken(refreshToken: RefreshToken): void {
    if (refreshToken.isExpired()) {
      throw new ExpiredRefreshTokenException();
    }

    if (refreshToken.isRevoked) {
      throw new RevokedRefreshTokenException();
    }
  }

  private async findUser(
    userId: string
  ): Promise<{ id: string; email: string; name?: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  private async saveNewRefreshToken(
    token: string,
    userId: string
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

    const newRefreshToken = new RefreshToken(token, userId as any, expiresAt);
    await this.refreshTokenRepository.create(newRefreshToken);
  }

  private async revokeOldRefreshToken(
    refreshToken: RefreshToken
  ): Promise<void> {
    refreshToken.revoke();
    await this.refreshTokenRepository.save(refreshToken);
  }
}
