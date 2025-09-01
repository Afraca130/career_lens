"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = void 0;
const common_1 = require("@nestjs/common");
let UserContext = class UserContext {
    constructor(userRepository, authService, userService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.userService = userService;
    }
    async changePassword(request) {
        const user = await this.userRepository.findById(request.userId);
        if (!user) {
            throw new Error("User not found");
        }
        this.userService.validatePasswordChange(user, request.newPassword);
        const hashedPassword = await this.authService.hashPassword(request.newPassword);
        const updatedUser = await this.userRepository.updatePassword(request.userId, hashedPassword);
        if (!updatedUser) {
            throw new Error("Failed to update password");
        }
        return updatedUser;
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
};
exports.UserContext = UserContext;
exports.UserContext = UserContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserContext);
//# sourceMappingURL=user.context.js.map