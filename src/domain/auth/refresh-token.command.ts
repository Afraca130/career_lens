export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}

  static from(refreshToken: string): RefreshTokenCommand {
    return new RefreshTokenCommand(refreshToken);
  }
}
