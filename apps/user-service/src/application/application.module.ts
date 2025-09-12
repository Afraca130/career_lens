import { Module } from "@nestjs/common";
import { DomainModule } from "../domain/domain.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { AuthApplicationService } from "./services/auth.application.service";
import { UserApplicationService } from "./services/user.application.service";
import { SignupUseCase } from "./use-cases/auth/signup.use-case";
import { LoginUseCase } from "./use-cases/auth/login.use-case";
import { VerifyTokenUseCase } from "./use-cases/auth/verify-token.use-case";
import { RefreshTokenUseCase } from "./use-cases/auth/refresh-token.use-case";
import { GetUserUseCase } from "./use-cases/user/get-user.use-case";
import { ChangePasswordUseCase } from "./use-cases/user/change-password.use-case";
import { GetUsersUseCase } from "./use-cases/user/get-users.use-case";
import { UpdateProfileUseCase } from "./use-cases/user/update-profile.use-case";
import { DeleteUserUseCase } from "./use-cases/user/delete-user.use-case";

/**
 * 애플리케이션 모듈
 * 유스케이스와 애플리케이션 서비스를 관리
 */
@Module({
  imports: [DomainModule, InfrastructureModule],
  providers: [
    AuthApplicationService,
    UserApplicationService,
    SignupUseCase,
    LoginUseCase,
    VerifyTokenUseCase,
    RefreshTokenUseCase,
    GetUserUseCase,
    ChangePasswordUseCase,
    GetUsersUseCase,
    UpdateProfileUseCase,
    DeleteUserUseCase,
  ],
  exports: [AuthApplicationService, UserApplicationService],
})
export class ApplicationModule {}
