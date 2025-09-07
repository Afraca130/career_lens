import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthBusinessModule } from "../../business/auth/auth-business.module";
import { JwtAuthGuard } from "../../infrastructure/guards/jwt-auth.guard";

@Module({
  imports: [AuthBusinessModule],
  controllers: [AuthController],
  providers: [JwtAuthGuard],
})
export class AuthModule {}
