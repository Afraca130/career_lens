import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { DomainException } from "../../domain/common/exceptions/domain.exception";
import { 
  UserNotFoundException,
  PasswordChangeNotAllowedException,
  InvalidPasswordException,
} from "../../domain/user/exceptions/user.exceptions";
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidTokenException,
} from "../../domain/auth/exceptions/auth.exceptions";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost) {
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

  private mapExceptionToHttpResponse(exception: DomainException): {
    status: HttpStatus;
    message: string;
  } {
    // User Exceptions
    if (exception instanceof UserNotFoundException) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "사용자를 찾을 수 없습니다.",
      };
    }

    if (exception instanceof PasswordChangeNotAllowedException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
    }

    if (exception instanceof InvalidPasswordException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
    }

    // Auth Exceptions
    if (exception instanceof EmailAlreadyExistsException) {
      return {
        status: HttpStatus.CONFLICT,
        message: "이미 존재하는 이메일입니다.",
      };
    }

    if (exception instanceof InvalidCredentialsException) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      };
    }

    if (exception instanceof InvalidTokenException) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: "유효하지 않은 토큰입니다.",
      };
    }

    // Default case
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "내부 서버 오류가 발생했습니다.",
    };
  }
}
