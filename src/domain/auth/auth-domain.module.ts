import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "../user/user-domain.module";
import { GenerateTokenUseCase } from "../../business/auth/generate-token.use-case";
import { ValidateUserUseCase } from "../../business/auth/validate-user.use-case";
import { RefreshTokenUseCase } from "../../business/auth/refresh-token.use-case";
import { RefreshTokenRepository } from "../../business/auth/refresh-token.repository";
import {
  RefreshToken,
  RefreshTokenSchema,
} from "./entity/refresh-token.entity";
import { IRefreshTokenRepository } from "./refresh-token.repository.interface";
import { AuthController } from "../../presentation/auth/auth.controller";
import { JwtStrategy } from "../../presentation/auth/strategies/jwt.strategy";
import { LocalStrategy } from "../../presentation/auth/strategies/local.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUseCase,
    GenerateTokenUseCase,
    RefreshTokenUseCase,
    {
      provide: IRefreshTokenRepository,
      useClass: RefreshTokenRepository,
    },
    RefreshTokenRepository,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    ValidateUserUseCase,
    GenerateTokenUseCase,
    RefreshTokenUseCase,
    IRefreshTokenRepository,
  ],
})
export class AuthModule {}
