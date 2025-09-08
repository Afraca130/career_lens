import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./persistence/typeorm/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

/**
 * 인프라스트럭처 모듈
 * 데이터베이스, 외부 서비스, 프레임워크 관련 구현체들을 관리
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    UserRepository,
    AuthService,
    UserService,
  ],
  exports: [
    UserRepository,
    AuthService,
    UserService,
  ],
})
export class InfrastructureModule {}
