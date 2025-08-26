import { Injectable, Inject } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { User } from "../../domain/user/entity/user.entity";
import { IUserRepository } from "../../domain/user/user.repository.interface";

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }
}
