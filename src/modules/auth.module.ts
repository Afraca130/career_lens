import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "../presentation/auth/auth.controller";
import { RefreshTokenUseCase } from "../business/auth/refresh-token.use-case";
import { GenerateTokenUseCase } from "../business/auth/generate-token.use-case";
import { TokenService } from "../infrastructure/auth/token.service";
import {
  RefreshToken,
  RefreshTokenSchema,
} from "../domain/auth/entity/refresh-token.entity";
import { AuthExceptionFilter } from "../presentation/filters/auth-exception.filter";
import {
  IRefreshTokenRepository,
  ITokenService,
  IUserRepository,
} from "../domain/auth";
import { RefreshTokenRepository } from "../infrastructure/auth/refresh-token.repository";
import { UserRepository } from "../infrastructure/auth/user.repository";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "access-secret",
      signOptions: { expiresIn: "24h" },
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RefreshTokenUseCase,
    GenerateTokenUseCase,

    // Services
    {
      provide: ITokenService,
      useClass: TokenService,
    },

    // Exception Filters
    AuthExceptionFilter,

    // Repository implementations
    {
      provide: IRefreshTokenRepository,
      useClass: RefreshTokenRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [RefreshTokenUseCase, GenerateTokenUseCase],
})
export class AuthModule {}
