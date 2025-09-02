"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_exceptions_1 = require("../../domain/user/exceptions/user.exceptions");
let UserService = class UserService {
    canChangePassword(user) {
        return user.signType === "email";
    }
    validatePasswordChange(user, newPassword) {
        if (!this.canChangePassword(user)) {
            throw new user_exceptions_1.PasswordChangeNotAllowedException(user.signType);
        }
        if (!newPassword || newPassword.trim().length === 0) {
            throw new user_exceptions_1.InvalidPasswordException("새 비밀번호를 입력해주세요.");
        }
        if (newPassword.length < 6) {
            throw new user_exceptions_1.InvalidPasswordException("비밀번호는 최소 6자 이상이어야 합니다.");
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map