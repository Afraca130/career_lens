import { Module } from "@nestjs/common";
import { UserBusiness } from "./user.business";
import { UserContextModule } from "../../context/user/user-context.module";

@Module({
  imports: [UserContextModule],
  providers: [UserBusiness],
  exports: [UserBusiness],
})
export class UserBusinessModule {}
