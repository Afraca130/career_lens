import { DomainException } from "../../common/exceptions/domain.exception";
export declare class EmailAlreadyExistsException extends DomainException {
    readonly code = "EMAIL_ALREADY_EXISTS";
    constructor(email: string);
}
export declare class InvalidCredentialsException extends DomainException {
    readonly code = "INVALID_CREDENTIALS";
    constructor();
}
export declare class InvalidTokenException extends DomainException {
    readonly code = "INVALID_TOKEN";
    constructor(message?: string);
}
