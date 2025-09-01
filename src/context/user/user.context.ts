import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { IAuthService } from "../../domain/auth/auth.service.interface";
import { IUserService } from "../../domain/user/user.service.interface";
import { User } from "../../domain/user/entity/user.entity";
import { ChangePasswordRequest } from "./interfaces";

@Injectable()
export class UserContext {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
    private readonly userService: IUserService
  ) {}

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    // 사용자 조회
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 비밀번호 변경 가능 여부 검증
    this.userService.validatePasswordChange(user, request.newPassword);

    // 새 비밀번호 해싱
    const hashedPassword = await this.authService.hashPassword(
      request.newPassword
    );

    // 비밀번호 업데이트
    const updatedUser = await this.userRepository.updatePassword(
      request.userId,
      hashedPassword
    );
    if (!updatedUser) {
      throw new Error("Failed to update password");
    }

    return updatedUser;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
