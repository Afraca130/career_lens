import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { User } from "../../domain/user/entity/user.domain";
import { UserEntity } from "../persistence/typeorm/user.entity";
import { UserMapper } from "../persistence/mappers/user.mapper";

/**
 * 사용자 리포지토리 구현체
 * 도메인 인터페이스를 구현하여 데이터베이스 접근을 담당
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const savedEntity = await this.userRepository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { email, isDeleted: false },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: string, user: User): Promise<User | null> {
    const entity = UserMapper.toEntity(user);
    await this.userRepository.update(id, entity);
    return this.findById(id);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User | null> {
    await this.userRepository.update(id, { password: hashedPassword });
    return this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User | null> {
    await this.userRepository.update(id, { refreshToken });
    return this.findById(id);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { refreshToken, isDeleted: false },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.update(id, { isDeleted: true });
    return result.affected > 0;
  }
}