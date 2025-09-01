"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextModule = void 0;
const common_1 = require("@nestjs/common");
const user_context_1 = require("./user.context");
const user_repository_1 = require("../../infrastructure/repositories/user.repository");
const auth_service_1 = require("../../infrastructure/services/auth.service");
const user_service_1 = require("../../infrastructure/services/user.service");
const user_domain_module_1 = require("../../domain/user/user-domain.module");
let UserContextModule = class UserContextModule {
};
exports.UserContextModule = UserContextModule;
exports.UserContextModule = UserContextModule = __decorate([
    (0, common_1.Module)({
        imports: [user_domain_module_1.UserDomainModule],
        providers: [user_context_1.UserContext, user_repository_1.UserRepository, auth_service_1.AuthService, user_service_1.UserService],
        exports: [user_context_1.UserContext],
    })
], UserContextModule);
//# sourceMappingURL=user-context.module.js.map