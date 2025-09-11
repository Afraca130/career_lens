import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

/**
 * 인증된 사용자 정보 인터페이스
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  type: string;
  iat: number;
  exp: number;
}

/**
 * JWT 인증 가드
 * JWT 토큰을 검증하고 사용자 정보를 추출하는 공통 기능
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("인증 토큰이 필요합니다.");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });
      
      // 토큰에서 사용자 정보를 request 객체에 추가
      request["user"] = payload as AuthenticatedUser;
    } catch (error) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
