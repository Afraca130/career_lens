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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_business_1 = require("../../business/user/user.business");
const change_password_dto_1 = require("./dto/change-password.dto");
let UserController = class UserController {
    constructor(userBusiness) {
        this.userBusiness = userBusiness;
    }
    async changePassword(userId, changePasswordDto) {
        try {
            return await this.userBusiness.changePassword({
                userId,
                newPassword: changePasswordDto.newPassword,
            });
        }
        catch (error) {
            if (error.message.includes("가입한 사용자는 비밀번호를 변경할 수 없습니다")) {
                throw new common_1.BadRequestException(error.message);
            }
            if (error.message === "User not found") {
                throw new common_1.NotFoundException("사용자를 찾을 수 없습니다.");
            }
            if (error.message.includes("비밀번호는 최소 6자 이상")) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(":userId/change-password"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 변경",
        description: "사용자의 비밀번호를 변경합니다. (kakao, naver 가입자는 변경 불가)",
    }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "비밀번호 변경 성공",
        schema: {
            example: {
                _id: "507f1f77bcf86cd799439011",
                name: "홍길동",
                email: "user@example.com",
                role: "user",
                signType: "email",
                isVerified: false,
                isDeleted: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "비밀번호 변경 불가 또는 잘못된 요청",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "사용자를 찾을 수 없음" }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("사용자"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_business_1.UserBusiness])
], UserController);
//# sourceMappingURL=user.controller.js.map