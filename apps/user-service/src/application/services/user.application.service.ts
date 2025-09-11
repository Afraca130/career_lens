import { Injectable } from "@nestjs/common";

import { ChangePasswordUseCase } from "../use-cases/user/change-password.use-case";
import { GetUserUseCase } from "../use-cases/user/get-user.use-case";
import { User } from "../../domain/user/entity/user.domain";
import { ChangePasswordRequest } from "../use-cases/user/dto/change-password.request";
import { GetUsersRequest } from "../use-cases/user/dto/get-users.request";
import { UpdateProfileRequest } from "../use-cases/user/dto/update-profile.request";
import { DeleteUserRequest } from "../use-cases/user/dto/delete-user.request";
import { DeleteUserUseCase } from "../use-cases/user/delete-user.use-case";
import { GetUsersUseCase } from "../use-cases/user/get-users.use-case";
import { UpdateProfileUseCase } from "../use-cases/user/update-profile.use-case";

@Injectable()
export class UserApplicationService {
  constructor(
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async getUser(userId: string): Promise<User> {
    return this.getUserUseCase.execute(userId);
  }

  async getUsers(request: GetUsersRequest): Promise<any> {
    return this.getUsersUseCase.execute(request);
  }

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    return this.changePasswordUseCase.execute(request);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<any> {
    return this.updateProfileUseCase.execute(request);
  }

  async deleteUser(userId: string): Promise<any> {
    const request = new DeleteUserRequest(userId);
    return this.deleteUserUseCase.execute(request);
  }
}
