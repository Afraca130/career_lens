import { Module } from "@nestjs/common";
import { UserGrpcController } from "./user.grpc.controller";
import { AuthGrpcClient } from "./auth.grpc.client";

/**
 * gRPC 사용자 모듈
 * gRPC 서버 기능을 제공
 */
@Module({
  controllers: [UserGrpcController],
  providers: [AuthGrpcClient],
  exports: [AuthGrpcClient],
})
export class UserGrpcModule {}
