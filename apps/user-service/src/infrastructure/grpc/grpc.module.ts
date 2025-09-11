import { Module, forwardRef } from "@nestjs/common";
import { AuthGrpcController } from "./auth.grpc.controller";
import { UserGrpcController } from "./user.grpc.controller";
import { ApplicationModule } from "../../application/application.module";

@Module({
  imports: [forwardRef(() => ApplicationModule)],
  controllers: [AuthGrpcController, UserGrpcController],
})
export class GrpcModule {}
