import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { GetUserUseCase } from '../../../business/user/get-user.use-case';
import { JwtPayload } from '../../../domain/auth/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly getUserUseCase: GetUserUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.getUserUseCase.executeById(payload.sub);
      return { id: user.id, email: user.email };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}