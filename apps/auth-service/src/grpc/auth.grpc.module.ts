import { Module } from "@nestjs/common";
import { AuthGrpcController } from "./auth.grpc.controller";
import { ApplicationModule } from "../application/application.module";

/**
 * gRPC 인증 모듈
 * gRPC 서버 기능을 제공
 */
@Module({
  imports: [ApplicationModule],
  controllers: [AuthGrpcController],
})
export class AuthGrpcModule {}
