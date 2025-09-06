import { Module } from "@nestjs/common";
import { AuthContext } from "./auth.context";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { AuthService } from "../../infrastructure/services/auth.service";
import { UserDomainModule } from "../../domain/user/user-domain.module";

@Module({
  imports: [UserDomainModule],
  providers: [AuthContext, UserRepository, AuthService],
  exports: [AuthContext],
})
export class AuthContextModule {}
