import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { UserController } from "./user.controller";
import { UserGrpcClient } from "./user-grpc.client";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: ["auth", "user"],
          protoPath: [
            join(__dirname, "../../../proto/auth.proto"),
            join(__dirname, "../../../proto/user.proto"),
          ],
          url: process.env.USER_SERVICE_GRPC_URL || "localhost:50051",
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserGrpcClient],
  exports: [UserGrpcClient],
})
export class UserModule {}
