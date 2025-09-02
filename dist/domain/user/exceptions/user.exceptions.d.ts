import { DomainException } from "../../common/exceptions/domain.exception";
export declare class UserNotFoundException extends DomainException {
    readonly code = "USER_NOT_FOUND";
    constructor(userId: string);
}
export declare class UserValidationException extends DomainException {
    readonly code = "USER_VALIDATION_ERROR";
    constructor(message: string);
}
export declare class PasswordChangeNotAllowedException extends DomainException {
    readonly code = "PASSWORD_CHANGE_NOT_ALLOWED";
    constructor(signType: string);
}
export declare class InvalidPasswordException extends DomainException {
    readonly code = "INVALID_PASSWORD";
    constructor(message: string);
}
