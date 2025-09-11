import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { UserMicroservice } from "@app/common";
import { ChangePasswordRequest } from "../../application/use-cases/user/dto/change-password.request";
import { UserApplicationService } from "../../application/services/user.application.service";

@Controller()
export class UserGrpcController {
  constructor(
    private readonly userApplicationService: UserApplicationService
  ) {}

  @GrpcMethod("UserService", "GetUser")
  async getUser(data: UserMicroservice.GetUserRequest) {
    const user = await this.userApplicationService.getUser(data.userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      signType: user.signType,
      isVerified: user.isVerified,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @GrpcMethod("UserService", "UpdateProfile")
  async updateProfile(data: UserMicroservice.UpdateProfileRequest) {
    // 프로필 업데이트 로직 구현 필요
    // 현재는 기본 사용자 정보 반환
    const user = await this.userApplicationService.getUser(data.userId);

    return {
      id: user.id,
      name: data.name || user.name,
      email: data.email || user.email,
      role: user.role,
      signType: user.signType,
      isVerified: user.isVerified,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  @GrpcMethod("UserService", "ChangePassword")
  async changePassword(data: UserMicroservice.ChangePasswordRequest) {
    const request = new ChangePasswordRequest(data.userId, data.newPassword);
    const result = await this.userApplicationService.changePassword(request);

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      signType: result.signType,
      isVerified: result.isVerified,
      isDeleted: result.isDeleted,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @GrpcMethod("UserService", "DeleteUser")
  async deleteUser(data: UserMicroservice.DeleteUserRequest) {
    // 사용자 삭제 로직 구현 필요
    // 현재는 성공 응답만 반환
    return {
      success: true,
      message: "User deleted successfully",
    };
  }

  @GrpcMethod("UserService", "GetUsers")
  async getUsers(data: UserMicroservice.GetUsersRequest) {
    // 사용자 목록 조회 로직 구현 필요
    // 현재는 빈 목록 반환
    return {
      users: [],
      total: 0,
      page: data.page,
      limit: data.limit,
    };
  }
}
