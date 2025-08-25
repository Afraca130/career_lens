import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/user/user.entity';
import { IUserRepository } from '../domain/user/user.repository.interface';
import { UserRepository } from '../business/user/user.repository';
import { CreateUserUseCase } from '../business/user/create-user.use-case';
import { GetUserUseCase } from '../business/user/get-user.use-case';
import { UserController } from '../presentation/user/user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    GetUserUseCase,
    UserRepository,
  ],
  exports: [
    IUserRepository,
    CreateUserUseCase,
    GetUserUseCase,
    UserRepository,
  ],
})
export class UserModule {}