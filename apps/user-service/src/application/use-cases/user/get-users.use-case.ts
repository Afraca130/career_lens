import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { GetUsersRequest } from "./dto/get-users.request";
import { GetUsersResponse } from "./dto/get-users.response";

@Injectable()
export class GetUsersUseCase {
  constructor(@Inject("IUserRepository")
    private readonly userRepository: IUserRepository) {}

  async execute(request: GetUsersRequest): Promise<GetUsersResponse> {
    // TODO: 실제 구현 필요 - 현재는 빈 목록 반환
    const users = [];
    const total = 0;

    return new GetUsersResponse(users, total, request.page, request.limit);
  }
}
