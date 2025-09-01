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
exports.UserBusiness = void 0;
const common_1 = require("@nestjs/common");
const user_context_1 = require("../../context/user/user.context");
let UserBusiness = class UserBusiness {
    constructor(userContext) {
        this.userContext = userContext;
    }
    async changePassword(request) {
        return this.userContext.changePassword(request);
    }
    async findById(id) {
        return this.userContext.findById(id);
    }
    async findByEmail(email) {
        return this.userContext.findByEmail(email);
    }
};
exports.UserBusiness = UserBusiness;
exports.UserBusiness = UserBusiness = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_1.UserContext])
], UserBusiness);
//# sourceMappingURL=user.business.js.map