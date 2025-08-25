import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ValidateUserUseCase } from '../business/auth/validate-user.use-case';
import { GenerateTokenUseCase } from '../business/auth/generate-token.use-case';
import { AuthController } from '../presentation/auth/auth.controller';
import { JwtStrategy } from '../presentation/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../presentation/auth/strategies/local.strategy';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUseCase,
    GenerateTokenUseCase,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [ValidateUserUseCase, GenerateTokenUseCase],
})
export class AuthModule {}