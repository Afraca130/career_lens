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
exports.AuthBusiness = void 0;
const common_1 = require("@nestjs/common");
const auth_context_1 = require("../../context/auth/auth.context");
let AuthBusiness = class AuthBusiness {
    constructor(authContext) {
        this.authContext = authContext;
    }
    async signup(request) {
        return this.authContext.signup(request);
    }
    async login(request) {
        return this.authContext.login(request);
    }
    async verifyToken(token) {
        return this.authContext.verifyToken(token);
    }
};
exports.AuthBusiness = AuthBusiness;
exports.AuthBusiness = AuthBusiness = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_context_1.AuthContext])
], AuthBusiness);
//# sourceMappingURL=auth.business.js.map