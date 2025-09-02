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
exports.AuthContext = void 0;
const common_1 = require("@nestjs/common");
const auth_exceptions_1 = require("../../domain/auth/exceptions/auth.exceptions");
let AuthContext = class AuthContext {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async signup(request) {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new auth_exceptions_1.EmailAlreadyExistsException(request.email);
        }
        const hashedPassword = await this.authService.hashPassword(request.password);
        const user = await this.userRepository.create({
            name: request.name,
            email: request.email,
            password: hashedPassword,
            signType: request.signType || "email",
            role: "user",
        });
        return user;
    }
    async login(request) {
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new auth_exceptions_1.InvalidCredentialsException();
        }
        const isPasswordValid = await this.authService.comparePassword(request.password, user.password);
        if (!isPasswordValid) {
            throw new auth_exceptions_1.InvalidCredentialsException();
        }
        const token = this.authService.generateToken({
            userId: user.id,
            email: user.email,
            type: "access",
        });
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async verifyToken(token) {
        try {
            const cleanToken = token.replace("Bearer ", "");
            if (!cleanToken) {
                throw new auth_exceptions_1.InvalidTokenException("Token is required");
            }
            const payload = this.authService.verifyToken(cleanToken);
            return payload;
        }
        catch (error) {
            if (error instanceof auth_exceptions_1.InvalidTokenException) {
                throw error;
            }
            throw new auth_exceptions_1.InvalidTokenException();
        }
    }
};
exports.AuthContext = AuthContext;
exports.AuthContext = AuthContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], AuthContext);
//# sourceMappingURL=auth.context.js.map