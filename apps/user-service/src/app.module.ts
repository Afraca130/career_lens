import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { ApplicationModule } from "./application/application.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { UserDomainExceptionFilter } from "./infrastructure/framework/filters/user-domain-exception.filter";
import { UserEntity } from "./infrastructure/persistence/typeorm/user.entity";
import { LoggingInterceptor } from "@app/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "user_service",
      entities: [UserEntity],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),
    ApplicationModule,
    InfrastructureModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: UserDomainExceptionFilter,
    },
  ],
})
export class AppModule {}
