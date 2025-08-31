import { ApiProperty } from "@nestjs/swagger";
import { RefreshTokenResult } from "../../../domain/auth/refresh-token-result.interface";

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: "새로 발급된 액세스 토큰 (24시간 유효)",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  access_token: string;

  @ApiProperty({
    description: "새로 발급된 리프레시 토큰 (30일 유효)",
    example: "a1b2c3d4e5f6789...",
  })
  refresh_token: string;

  @ApiProperty({
    description: "사용자 정보",
    example: {
      id: "user-id",
      email: "user@example.com",
      name: "사용자 이름",
    },
  })
  user: {
    id: string;
    email: string;
    name?: string;
  };

  constructor(refreshTokenResult: RefreshTokenResult) {
    this.access_token = refreshTokenResult.access_token;
    this.refresh_token = refreshTokenResult.refresh_token;
    this.user = refreshTokenResult.user;
  }

  static from(refreshTokenResult: RefreshTokenResult): RefreshTokenResponseDto {
    return new RefreshTokenResponseDto(refreshTokenResult);
  }
}
