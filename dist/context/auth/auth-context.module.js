"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContextModule = void 0;
const common_1 = require("@nestjs/common");
const auth_context_1 = require("./auth.context");
const user_repository_1 = require("../../infrastructure/repositories/user.repository");
const auth_service_1 = require("../../infrastructure/services/auth.service");
const user_domain_module_1 = require("../../domain/user/user-domain.module");
let AuthContextModule = class AuthContextModule {
};
exports.AuthContextModule = AuthContextModule;
exports.AuthContextModule = AuthContextModule = __decorate([
    (0, common_1.Module)({
        imports: [user_domain_module_1.UserDomainModule],
        providers: [auth_context_1.AuthContext, user_repository_1.UserRepository, auth_service_1.AuthService],
        exports: [auth_context_1.AuthContext],
    })
], AuthContextModule);
//# sourceMappingURL=auth-context.module.js.map