import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ApplicationModule } from "../../application/application.module";
import { SharedModule } from "../../shared/shared.module";

/**
 * 인증 프레젠테이션 모듈
 * 컨트롤러와 애플리케이션 레이어를 연결
 */
@Module({
  imports: [ApplicationModule, SharedModule],
  controllers: [AuthController],
})
export class AuthModule {}
