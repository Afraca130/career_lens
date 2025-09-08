/**
 * 로그인 응답 DTO
 */
export class LoginResponse {
  constructor(
    public readonly access_token: string,
    public readonly refresh_token: string,
    public readonly user: {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  ) {}
}
