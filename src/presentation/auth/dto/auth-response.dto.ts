import { AuthResult } from '../../../domain/auth/auth-result.interface';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };

  constructor(authResult: AuthResult) {
    this.access_token = authResult.access_token;
    this.user = authResult.user;
  }

  static from(authResult: AuthResult): AuthResponseDto {
    return new AuthResponseDto(authResult);
  }
}