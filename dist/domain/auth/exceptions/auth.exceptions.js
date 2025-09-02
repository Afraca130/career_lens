"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenException = exports.InvalidCredentialsException = exports.EmailAlreadyExistsException = void 0;
const domain_exception_1 = require("../../common/exceptions/domain.exception");
class EmailAlreadyExistsException extends domain_exception_1.DomainException {
    constructor(email) {
        super(`Email ${email} already exists`);
        this.code = "EMAIL_ALREADY_EXISTS";
    }
}
exports.EmailAlreadyExistsException = EmailAlreadyExistsException;
class InvalidCredentialsException extends domain_exception_1.DomainException {
    constructor() {
        super("Invalid email or password");
        this.code = "INVALID_CREDENTIALS";
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class InvalidTokenException extends domain_exception_1.DomainException {
    constructor(message = "Invalid or expired token") {
        super(message);
        this.code = "INVALID_TOKEN";
    }
}
exports.InvalidTokenException = InvalidTokenException;
//# sourceMappingURL=auth.exceptions.js.map