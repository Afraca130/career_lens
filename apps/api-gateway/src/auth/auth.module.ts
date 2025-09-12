import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthGrpcClient } from "./auth-grpc.client";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: ["auth"],
          protoPath: [join(__dirname, "../../../proto/auth.proto")],
          url: process.env.AUTH_SERVICE_GRPC_URL || "localhost:50051",
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthGrpcClient],
  exports: [AuthGuard, AuthGrpcClient],
})
export class AuthModule {}
