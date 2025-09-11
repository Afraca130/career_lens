/**
 * 비밀번호 변경 요청 DTO
 */
export class ChangePasswordRequest {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string
  ) {}
}
