import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  InvalidRefreshTokenException,
  ExpiredRefreshTokenException,
  RevokedRefreshTokenException,
  UserNotFoundException,
} from "../../domain/auth/refresh-token.exception";

@Catch(
  InvalidRefreshTokenException,
  ExpiredRefreshTokenException,
  RevokedRefreshTokenException,
  UserNotFoundException
)
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    this.logger.warn(`Auth Exception: ${status} - ${message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getHttpStatus(exception: Error): number {
    switch (exception.constructor) {
      case InvalidRefreshTokenException:
      case ExpiredRefreshTokenException:
      case RevokedRefreshTokenException:
        return HttpStatus.UNAUTHORIZED;
      case UserNotFoundException:
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getErrorMessage(exception: Error): string {
    switch (exception.constructor) {
      case InvalidRefreshTokenException:
        return "유효하지 않은 리프레시 토큰입니다";
      case ExpiredRefreshTokenException:
        return "리프레시 토큰이 만료되었습니다";
      case RevokedRefreshTokenException:
        return "리프레시 토큰이 폐기되었습니다";
      case UserNotFoundException:
        return "사용자를 찾을 수 없습니다";
      default:
        return "인증 처리 중 오류가 발생했습니다";
    }
  }
}
