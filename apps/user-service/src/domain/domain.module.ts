import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";

/**
 * 도메인 모듈
 * 순수한 비즈니스 로직과 도메인 규칙을 관리
 * Infrastructure 의존성 없이 순수한 도메인 로직만 포함
 */
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService],
})
export class DomainModule {}
