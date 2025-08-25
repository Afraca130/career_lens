import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/user/user.entity';
import { AuthResult } from '../../domain/auth/auth-result.interface';
import { JwtPayload } from '../../domain/auth/jwt-payload.interface';

@Injectable()
export class GenerateTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: User): AuthResult {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}