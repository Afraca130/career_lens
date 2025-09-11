import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Auth Service API")
    .setDescription("Authentication and authorization microservice")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // gRPC 마이크로서비스 설정
  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: ["auth", "user"],
      protoPath: [
        join(__dirname, "../../../proto/auth.proto"),
        join(__dirname, "../../../proto/user.proto"),
      ],
      url: configService.get("GRPC_URL") || "0.0.0.0:50051",
    },
  };

  // gRPC 마이크로서비스 연결
  app.connectMicroservice<MicroserviceOptions>(grpcOptions);

  // 애플리케이션 시작
  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`User Service HTTP is running on: http://localhost:${port}`);
  console.log(
    `User Service gRPC is running on: ${process.env.GRPC_URL || "0.0.0.0:50051"}`
  );
}
bootstrap();
