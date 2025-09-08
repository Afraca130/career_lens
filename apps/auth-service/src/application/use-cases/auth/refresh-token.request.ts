/**
 * Refresh Token 요청 DTO
 */
export class RefreshTokenRequest {
  constructor(public readonly refresh_token: string) {}
}
