/**
 * Refresh Token 응답 DTO
 */
export class RefreshTokenResponse {
  constructor(
    public readonly access_token: string,
    public readonly refresh_token: string
  ) {}
}
