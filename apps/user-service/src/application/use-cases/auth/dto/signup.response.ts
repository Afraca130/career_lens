/**
 * 회원가입 응답 DTO
 */
export class SignupResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
    public readonly signType: string,
    public readonly isVerified: boolean,
    public readonly createdAt: Date
  ) {}
}
