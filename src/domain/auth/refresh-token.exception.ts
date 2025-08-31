export class InvalidRefreshTokenException extends Error {
  constructor(message: string = "Invalid refresh token") {
    super(message);
    this.name = "InvalidRefreshTokenException";
  }
}

export class ExpiredRefreshTokenException extends Error {
  constructor(message: string = "Refresh token has expired") {
    super(message);
    this.name = "ExpiredRefreshTokenException";
  }
}

export class RevokedRefreshTokenException extends Error {
  constructor(message: string = "Refresh token has been revoked") {
    super(message);
    this.name = "RevokedRefreshTokenException";
  }
}

export class UserNotFoundException extends Error {
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundException";
  }
}
