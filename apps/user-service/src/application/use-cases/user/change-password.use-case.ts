import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { IAuthService } from "../../../domain/auth/auth.service.interface";
import { IUserService } from "../../../domain/user/user.service.interface";
import { User } from "../../../domain/user/entity/user.domain";
import { ChangePasswordRequest } from "./dto/change-password.request";
import { UserNotFoundException } from "../../../domain/user/exceptions";

/**
 * 비밀번호 변경 유스케이스
 */
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject("IUserRepository")
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IAuthService")
    @Inject("IAuthService")
    private readonly authService: IAuthService,
    @Inject("IUserService")
    @Inject("IUserService")
    private readonly userService: IUserService
  ) {}

  async execute(request: ChangePasswordRequest): Promise<User> {
    // 1. 사용자 조회
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new UserNotFoundException(request.userId);
    }

    // 2. 비밀번호 변경 가능 여부 검증
    this.userService.validatePasswordChange(user, request.newPassword);

    // 3. 새 비밀번호 해싱
    const hashedPassword = await this.authService.hashPassword(
      request.newPassword
    );

    // 4. 사용자 도메인 객체 업데이트
    const updatedUser = user.updatePassword(hashedPassword);

    // 5. 사용자 저장
    const savedUser = await this.userRepository.updatePassword(
      request.userId,
      hashedPassword
    );
    if (!savedUser) {
      throw new UserNotFoundException(request.userId);
    }

    return savedUser;
  }
}
