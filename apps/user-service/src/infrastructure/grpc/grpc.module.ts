import { Module, forwardRef } from "@nestjs/common";
import { AuthGrpcController } from "./auth.grpc.controller";
import { UserGrpcController } from "./user.grpc.controller";

@Module({
  controllers: [AuthGrpcController, UserGrpcController],
})
export class GrpcModule {}
