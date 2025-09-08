import { User } from "../../../domain/user/entity/user.domain";
import { UserEntity } from "../typeorm/user.entity";

/**
 * 사용자 도메인 객체와 TypeORM 엔티티 간의 매핑
 */
export class UserMapper {
  /**
   * TypeORM 엔티티를 도메인 객체로 변환
   */
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.role,
      entity.signType,
      entity.isVerified,
      entity.isDeleted,
      entity.createdAt,
      entity.updatedAt
    );
  }

  /**
   * 도메인 객체를 TypeORM 엔티티로 변환
   */
  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.role = domain.role;
    entity.signType = domain.signType;
    entity.isVerified = domain.isVerified;
    entity.isDeleted = domain.isDeleted;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  /**
   * 도메인 객체 배열을 TypeORM 엔티티 배열로 변환
   */
  static toEntityArray(domains: User[]): UserEntity[] {
    return domains.map(domain => this.toEntity(domain));
  }

  /**
   * TypeORM 엔티티 배열을 도메인 객체 배열로 변환
   */
  static toDomainArray(entities: UserEntity[]): User[] {
    return entities.map(entity => this.toDomain(entity));
  }
}
