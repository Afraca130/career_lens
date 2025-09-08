import { Module } from "@nestjs/common";
import { AuthApplicationService } from "./services/auth.application.service";
import { SignupUseCase } from "./use-cases/auth/signup.use-case";
import { LoginUseCase } from "./use-cases/auth/login.use-case";
import { VerifyTokenUseCase } from "./use-cases/auth/verify-token.use-case";
import { RefreshTokenUseCase } from "./use-cases/auth/refresh-token.use-case";
import { GetUserUseCase } from "./use-cases/user/get-user.use-case";
import { ChangePasswordUseCase } from "./use-cases/user/change-password.use-case";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { SharedModule } from "../shared/shared.module";

/**
 * 애플리케이션 모듈
 * 유스케이스와 애플리케이션 서비스를 관리
 */
@Module({
  imports: [InfrastructureModule, SharedModule],
  providers: [
    AuthApplicationService,
    SignupUseCase,
    LoginUseCase,
    VerifyTokenUseCase,
    RefreshTokenUseCase,
    GetUserUseCase,
    ChangePasswordUseCase,
  ],
  exports: [AuthApplicationService],
})
export class ApplicationModule {}
