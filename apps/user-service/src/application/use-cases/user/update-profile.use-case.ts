import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { UpdateProfileRequest } from "./dto/update-profile.request";
import { UpdateProfileResponse } from "./dto/update-profile.response";
import { UserNotFoundException } from "../../../domain/user/exceptions/user.exceptions";

@Injectable()
export class UpdateProfileUseCase {
  constructor(@Inject("IUserRepository")
    private readonly userRepository: IUserRepository) {}

  async execute(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    // 1. 사용자 존재 확인
    const existingUser = await this.userRepository.findById(request.userId);
    if (!existingUser) {
      throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
    }

    // 2. 프로필 업데이트
    // TODO: 실제 업데이트 로직 구현 필요
    // 현재는 기존 사용자 정보 반환
    const updatedUser = existingUser;

    return new UpdateProfileResponse(updatedUser);
  }
}
