import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { DomainExceptionFilter } from "./filters/domain-exception.filter";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

/**
 * 공통 기능 모듈
 * 인터셉터, 필터, 가드 등 여러 레이어에서 공통으로 사용되는 기능들을 제공
 */
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [
    LoggingInterceptor,
    DomainExceptionFilter,
    JwtAuthGuard,
  ],
  exports: [
    LoggingInterceptor,
    DomainExceptionFilter,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class SharedModule {}
