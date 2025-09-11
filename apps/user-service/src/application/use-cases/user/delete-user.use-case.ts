import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { DeleteUserRequest } from "./dto/delete-user.request";
import { DeleteUserResponse } from "./dto/delete-user.response";
import { UserNotFoundException } from "../../../domain/user/exceptions/user.exceptions";

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject("IUserRepository")
    private readonly userRepository: IUserRepository) {}

  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    // 1. 사용자 존재 확인
    const existingUser = await this.userRepository.findById(request.userId);
    if (!existingUser) {
      throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
    }

    // 2. 사용자 삭제
    // TODO: 실제 삭제 로직 구현 필요
    // 현재는 성공 응답만 반환

    return new DeleteUserResponse(true, "사용자가 성공적으로 삭제되었습니다.");
  }
}
