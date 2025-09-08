import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { User } from "../../../domain/user/entity/user.domain";
import { UserNotFoundException } from "../../../domain/user/exceptions";

/**
 * 사용자 조회 유스케이스
 */
@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  }
}
