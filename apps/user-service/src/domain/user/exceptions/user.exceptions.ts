
import { DomainException } from "../../common/exceptions";

export class UserNotFoundException extends DomainException {
  readonly code = "USER_NOT_FOUND";
  
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
  }
}

export class UserValidationException extends DomainException {
  readonly code = "USER_VALIDATION_ERROR";
  
  constructor(message: string) {
    super(message);
  }
}

export class PasswordChangeNotAllowedException extends DomainException {
  readonly code = "PASSWORD_CHANGE_NOT_ALLOWED";
  
  constructor(signType: string) {
    super(`${signType}로 가입한 사용자는 비밀번호를 변경할 수 없습니다.`);
  }
}

export class InvalidPasswordException extends DomainException {
  readonly code = "INVALID_PASSWORD";
  
  constructor(message: string) {
    super(message);
  }
}
