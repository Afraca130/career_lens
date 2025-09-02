"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DomainExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const domain_exception_1 = require("../../domain/common/exceptions/domain.exception");
const user_exceptions_1 = require("../../domain/user/exceptions/user.exceptions");
const auth_exceptions_1 = require("../../domain/auth/exceptions/auth.exceptions");
let DomainExceptionFilter = DomainExceptionFilter_1 = class DomainExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(DomainExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, message } = this.mapExceptionToHttpResponse(exception);
        this.logger.error(`Domain Exception: ${exception.constructor.name} - ${exception.message}`, exception.stack);
        response.status(status).json({
            statusCode: status,
            message,
            error: exception.constructor.name,
            timestamp: new Date().toISOString(),
            path: request.url,
            code: exception.code,
        });
    }
    mapExceptionToHttpResponse(exception) {
        if (exception instanceof user_exceptions_1.UserNotFoundException) {
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                message: "사용자를 찾을 수 없습니다.",
            };
        }
        if (exception instanceof user_exceptions_1.PasswordChangeNotAllowedException) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: exception.message,
            };
        }
        if (exception instanceof user_exceptions_1.InvalidPasswordException) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: exception.message,
            };
        }
        if (exception instanceof auth_exceptions_1.EmailAlreadyExistsException) {
            return {
                status: common_1.HttpStatus.CONFLICT,
                message: "이미 존재하는 이메일입니다.",
            };
        }
        if (exception instanceof auth_exceptions_1.InvalidCredentialsException) {
            return {
                status: common_1.HttpStatus.UNAUTHORIZED,
                message: "이메일 또는 비밀번호가 올바르지 않습니다.",
            };
        }
        if (exception instanceof auth_exceptions_1.InvalidTokenException) {
            return {
                status: common_1.HttpStatus.UNAUTHORIZED,
                message: "유효하지 않은 토큰입니다.",
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: "내부 서버 오류가 발생했습니다.",
        };
    }
};
exports.DomainExceptionFilter = DomainExceptionFilter;
exports.DomainExceptionFilter = DomainExceptionFilter = DomainExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(domain_exception_1.DomainException)
], DomainExceptionFilter);
//# sourceMappingURL=domain-exception.filter.js.map