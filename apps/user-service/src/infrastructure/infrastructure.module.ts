import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserEntity } from "./persistence/typeorm/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { AuthController } from "./framework/controllers/auth.controller";
import { GrpcModule } from "./grpc/grpc.module";
import { IUserRepository } from "../domain/user/user.repository.interface";
import { IAuthService } from "../domain/auth/auth.service.interface";
import { IUserService } from "../domain/user/user.service.interface";
import { ApplicationModule } from "../application/application.module";

/**
 * 인프라스트럭처 모듈
 * 데이터베이스, 외부 서비스, 프레임워크 관련 구현체들을 관리
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
    forwardRef(() => ApplicationModule),
    GrpcModule,
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthService,
    UserService,
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IAuthService",
      useClass: AuthService,
    },
    {
      provide: "IUserService",
      useClass: UserService,
    },
  ],
  exports: [
    UserRepository,
    AuthService,
    UserService,
    "IUserRepository",
    "IAuthService",
    "IUserService",
  ],
})
export class InfrastructureModule {}
