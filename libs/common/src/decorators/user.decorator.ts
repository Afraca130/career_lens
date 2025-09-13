import { createParamDecorator, ExecutionContext } from "@nestjs/common";

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
 * JWT 토큰에서 사용자 정보를 추출하는 데코레이터
 * @param data - 추출할 특정 필드 (선택사항)
 * @returns 사용자 정보 또는 특정 필드 값
 */
export const User: any = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    return data ? user?.[data] : user;
  }
);
