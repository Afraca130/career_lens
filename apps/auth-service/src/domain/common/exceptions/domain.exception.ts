/**
 * 도메인 예외의 기본 클래스
 * 모든 도메인 관련 예외는 이 클래스를 상속받아야 합니다.
 */
export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    
    // Error.captureStackTrace가 지원되는 환경에서 스택 트레이스 최적화
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 예외의 상세 정보를 JSON 형태로 반환
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}
