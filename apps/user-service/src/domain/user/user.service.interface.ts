import { User } from "./entity/user.domain";

/**
 * 사용자 서비스 인터페이스
 * 사용자 관련 비즈니스 규칙을 정의
 */
export interface IUserService {
  canChangePassword(user: User): boolean;
  validatePasswordChange(user: User, newPassword: string): void;
}

