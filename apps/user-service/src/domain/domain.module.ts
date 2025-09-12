import { Module } from "@nestjs/common";
import { UserService } from "./user/user.service";

/**
 * 도메인 모듈
 * 순수한 비즈니스 로직과 도메인 규칙을 관리
 * Infrastructure 의존성 없이 순수한 도메인 로직만 포함
 */
@Module({
  providers: [UserService],
  exports: [UserService],
})
export class DomainModule {}
