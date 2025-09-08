/**
 * 로그인 요청 DTO
 */
export class LoginRequest {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
