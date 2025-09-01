import { Module } from "@nestjs/common";
import { AuthBusiness } from "./auth.business";
import { AuthContextModule } from "../../context/auth/auth-context.module";

@Module({
  imports: [AuthContextModule],
  providers: [AuthBusiness],
  exports: [AuthBusiness],
})
export class AuthBusinessModule {}
