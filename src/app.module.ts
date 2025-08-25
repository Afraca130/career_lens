import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, databaseConfig),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}