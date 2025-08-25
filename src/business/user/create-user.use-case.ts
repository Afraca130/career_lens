import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/user.entity';
import { IUserRepository } from '../../domain/user/user.repository.interface';

export interface CreateUserCommand {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, password, name } = command;

    const userExists = await this.userRepository.existsByEmail(email);
    if (userExists) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(email, hashedPassword, name);

    return this.userRepository.create(user);
  }
}