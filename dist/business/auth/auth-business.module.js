"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBusinessModule = void 0;
const common_1 = require("@nestjs/common");
const auth_business_1 = require("./auth.business");
const auth_context_module_1 = require("../../context/auth/auth-context.module");
let AuthBusinessModule = class AuthBusinessModule {
};
exports.AuthBusinessModule = AuthBusinessModule;
exports.AuthBusinessModule = AuthBusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_context_module_1.AuthContextModule],
        providers: [auth_business_1.AuthBusiness],
        exports: [auth_business_1.AuthBusiness],
    })
], AuthBusinessModule);
//# sourceMappingURL=auth-business.module.js.map