import { HttpStatus } from "@nestjs/common";
import { DomainExceptionFilter } from "./domain-exception.filter";

// Domain exceptions will be imported by the consuming service

/**
 * 사용자 서비스 전용 도메인 예외 필터
 */
export class UserDomainExceptionFilter extends DomainExceptionFilter {
  protected mapExceptionToHttpResponse(exception: any): {
    status: HttpStatus;
    message: string;
  } {
    // 기본 구현 호출 - 구체적인 예외 처리는 상속받는 클래스에서 구현
    return super.mapExceptionToHttpResponse(exception);
  }
}
