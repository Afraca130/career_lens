import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./domain/user/user-domain.module";
import { AuthModule } from "./domain/auth/auth-domain.module";
import { databaseConfig } from "./config/database.config";

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, databaseConfig),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
