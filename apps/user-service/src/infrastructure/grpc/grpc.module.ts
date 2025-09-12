import { Module } from "@nestjs/common";
import { ApplicationModule } from "../../application/application.module";
import { AuthGrpcController } from "./auth.grpc.controller";
import { UserGrpcController } from "./user.grpc.controller";

@Module({
  imports: [ApplicationModule],
  controllers: [AuthGrpcController, UserGrpcController],
})
export class GrpcModule {}
