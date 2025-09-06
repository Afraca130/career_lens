import { DomainException } from "../../common/exceptions/domain.exception";

export class EmailAlreadyExistsException extends DomainException {
  readonly code = "EMAIL_ALREADY_EXISTS";
  
  constructor(email: string) {
    super(`Email ${email} already exists`);
  }
}

export class InvalidCredentialsException extends DomainException {
  readonly code = "INVALID_CREDENTIALS";
  
  constructor() {
    super("Invalid email or password");
  }
}

export class InvalidTokenException extends DomainException {
  readonly code = "INVALID_TOKEN";
  
  constructor(message: string = "Invalid or expired token") {
    super(message);
  }
}
