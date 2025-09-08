import { User } from "./entity/user.domain";

/**
 * 사용자 리포지토리 인터페이스
 * 도메인 레이어에서 정의하며, 인프라스트럭처 레이어에서 구현
 */
export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: User): Promise<User | null>;
  updatePassword(id: string, hashedPassword: string): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
