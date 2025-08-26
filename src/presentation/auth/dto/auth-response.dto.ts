import { ApiProperty } from '@nestjs/swagger';
import { AuthResult } from '../../../domain/auth/auth-result.interface';

export class AuthResponseDto {
  @ApiProperty({
    description: '액세스 토큰 (24시간 유효)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: '리프레시 토큰 (30일 유효)',
    example: 'a1b2c3d4e5f6789...',
  })
  refresh_token: string;

  @ApiProperty({
    description: '사용자 정보',
    type: Object,
    properties: {
      id: { type: 'string', description: '사용자 ID' },
      email: { type: 'string', description: '사용자 이메일' },
      name: { type: 'string', description: '사용자 이름', nullable: true },
    },
  })
  user: {
    id: string;
    email: string;
    name?: string;
  };

  constructor(authResult: AuthResult) {
    this.access_token = authResult.access_token;
    this.refresh_token = authResult.refresh_token;
    this.user = authResult.user;
  }

  static from(authResult: AuthResult): AuthResponseDto {
    return new AuthResponseDto(authResult);
  }
}