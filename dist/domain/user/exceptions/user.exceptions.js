"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPasswordException = exports.PasswordChangeNotAllowedException = exports.UserValidationException = exports.UserNotFoundException = void 0;
const domain_exception_1 = require("../../common/exceptions/domain.exception");
class UserNotFoundException extends domain_exception_1.DomainException {
    constructor(userId) {
        super(`User with id ${userId} not found`);
        this.code = "USER_NOT_FOUND";
    }
}
exports.UserNotFoundException = UserNotFoundException;
class UserValidationException extends domain_exception_1.DomainException {
    constructor(message) {
        super(message);
        this.code = "USER_VALIDATION_ERROR";
    }
}
exports.UserValidationException = UserValidationException;
class PasswordChangeNotAllowedException extends domain_exception_1.DomainException {
    constructor(signType) {
        super(`${signType}로 가입한 사용자는 비밀번호를 변경할 수 없습니다.`);
        this.code = "PASSWORD_CHANGE_NOT_ALLOWED";
    }
}
exports.PasswordChangeNotAllowedException = PasswordChangeNotAllowedException;
class InvalidPasswordException extends domain_exception_1.DomainException {
    constructor(message) {
        super(message);
        this.code = "INVALID_PASSWORD";
    }
}
exports.InvalidPasswordException = InvalidPasswordException;
//# sourceMappingURL=user.exceptions.js.map