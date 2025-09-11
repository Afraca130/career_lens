import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

/**
 * 로깅 인터셉터
 * 모든 HTTP 요청/응답을 로깅하는 공통 기능
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const userAgent = request.get("User-Agent") || "";
    const ip = request.ip;

    const now = Date.now();
    this.logger.log(`${method} ${url}: ${userAgent} IP: ${ip} - START`);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const delay = Date.now() - now;

        this.logger.log(
          `${method} ${url} ${statusCode} - ${delay}ms - SUCCESS`
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          `${method} ${url} - ${delay}ms - ERROR: ${error.message}`,
          error.stack
        );
        return throwError(() => error);
      })
    );
  }
}
