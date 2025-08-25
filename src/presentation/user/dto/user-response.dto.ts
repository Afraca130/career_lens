import { User } from '../../../domain/user/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static from(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}