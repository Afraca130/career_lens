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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_business_1 = require("../../business/auth/auth.business");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
let AuthController = class AuthController {
    constructor(authBusiness) {
        this.authBusiness = authBusiness;
    }
    async signup(signupDto) {
        return await this.authBusiness.signup(signupDto);
    }
    async login(loginDto) {
        return await this.authBusiness.login(loginDto);
    }
    async verifyToken(authorization) {
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        return await this.authBusiness.verifyToken(authorization);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signup"),
    (0, swagger_1.ApiOperation)({
        summary: "회원가입",
        description: "새로운 사용자를 등록합니다.",
    }),
    (0, swagger_1.ApiBody)({ type: signup_dto_1.SignupDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "회원가입 성공",
        schema: {
            example: {
                _id: "507f1f77bcf86cd799439011",
                name: "홍길동",
                email: "user@example.com",
                role: "user",
                isDeleted: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "이메일 중복" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "잘못된 요청 데이터" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "로그인", description: "사용자 인증을 수행합니다." }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "로그인 성공",
        schema: {
            example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                    id: "507f1f77bcf86cd799439011",
                    email: "user@example.com",
                    name: "홍길동",
                    role: "user",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "사용자를 찾을 수 없음" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "잘못된 비밀번호" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("verify"),
    (0, swagger_1.ApiOperation)({
        summary: "토큰 검증",
        description: "JWT 토큰의 유효성을 검증합니다.",
    }),
    (0, swagger_1.ApiHeader)({
        name: "Authorization",
        description: "Bearer JWT 토큰",
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "토큰 검증 성공",
        schema: {
            example: {
                userId: "507f1f77bcf86cd799439011",
                email: "user@example.com",
                type: "access",
                iat: 1640995200,
                exp: 1641081600,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "유효하지 않은 토큰" }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("인증"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_business_1.AuthBusiness])
], AuthController);
//# sourceMappingURL=auth.controller.js.map