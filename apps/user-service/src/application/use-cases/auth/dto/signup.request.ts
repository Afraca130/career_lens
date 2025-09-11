/**
 * 회원가입 요청 DTO
 */
export class SignupRequest {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly signType?: string
  ) {}
}
