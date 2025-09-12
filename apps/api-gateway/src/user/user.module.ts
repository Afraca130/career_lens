import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { UserController } from "./user.controller";
import { UserGrpcClient } from "./user-grpc.client";
import { AuthGuard } from "../auth/auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
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
          url: process.env.USER_SERVICE_GRPC_URL || "user-service:50051",
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserGrpcClient],
  exports: [UserGrpcClient],
})
export class UserModule {}
