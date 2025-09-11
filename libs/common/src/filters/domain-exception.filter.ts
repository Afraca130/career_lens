import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

/**
 * 기본 도메인 예외 인터페이스
 */
export interface BaseDomainException {
  message: string;
  code?: string;
  stack?: string;
}

/**
 * 도메인 예외 필터
 * 도메인 예외를 HTTP 응답으로 변환하는 공통 기능
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, message } = this.mapExceptionToHttpResponse(exception);

    this.logger.error(
      `Domain Exception: ${exception.constructor.name} - ${exception.message}`,
      exception.stack
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.constructor.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: exception.code,
    });
  }

  protected mapExceptionToHttpResponse(exception: any): {
    status: HttpStatus;
    message: string;
  } {
    // 기본 구현 - 각 서비스에서 상속받아 오버라이드
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "내부 서버 오류가 발생했습니다.",
    };
  }
}
