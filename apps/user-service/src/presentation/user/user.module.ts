import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserBusinessModule } from "../../business/user/user-business.module";

@Module({
  imports: [UserBusinessModule],
  controllers: [UserController],
})
export class UserModule {}
