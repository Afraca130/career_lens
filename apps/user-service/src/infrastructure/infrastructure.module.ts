import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserEntity } from "./persistence/typeorm/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { AuthController } from "./framework/controllers/auth.controller";
import { GrpcModule } from "./grpc/grpc.module";
import { IUserRepository } from "../domain/user/user.repository.interface";
import { ApplicationModule } from "../application/application.module";

/**
 * 인프라스트럭처 모듈
 * 데이터베이스, 외부 서비스, 프레임워크 관련 구현체들을 관리
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ApplicationModule,
    GrpcModule,
  ],
  providers: [
    UserRepository,
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
  ],
  exports: [UserRepository, "IUserRepository"],
})
export class InfrastructureModule {}
