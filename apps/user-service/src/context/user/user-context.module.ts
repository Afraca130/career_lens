import { Module } from "@nestjs/common";
import { UserContext } from "./user.context";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { AuthService } from "../../infrastructure/services/auth.service";
import { UserService } from "../../infrastructure/services/user.service";
import { UserDomainModule } from "../../domain/user/user-domain.module";

@Module({
  imports: [UserDomainModule],
  providers: [UserContext, UserRepository, AuthService, UserService],
  exports: [UserContext],
})
export class UserContextModule {}
