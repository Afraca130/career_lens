"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./presentation/auth/auth.module");
const user_module_1 = require("./presentation/user/user.module");
const logging_interceptor_1 = require("./infrastructure/interceptors/logging.interceptor");
const user_entity_1 = require("./domain/user/entity/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST || "localhost",
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || "postgres",
                password: process.env.DB_PASSWORD || "password",
                database: process.env.DB_DATABASE || "career_lens",
                entities: [user_entity_1.User],
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.NODE_ENV === "development",
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || "your-secret-key",
                signOptions: { expiresIn: "24h" },
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map