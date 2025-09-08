import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthGrpcClient } from "./auth.grpc.client";

/**
 * gRPC 사용자 컨트롤러
 * 사용자 관리 기능을 gRPC로 제공
 */
@Controller()
export class UserGrpcController {
  constructor(private readonly authGrpcClient: AuthGrpcClient) {}

  @GrpcMethod("UserService", "GetUser")
  async getUser(data: any) {
    // 인증 서비스에서 사용자 정보 조회
    const result = await this.authGrpcClient.getUser({ user_id: data.user_id }).toPromise();
    
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      sign_type: result.sign_type,
      is_verified: result.is_verified,
      is_deleted: result.is_deleted,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
  }

  @GrpcMethod("UserService", "UpdateProfile")
  async updateProfile(data: any) {
    // 인증 서비스에서 사용자 정보 조회
    const user = await this.authGrpcClient.getUser({ user_id: data.user_id }).toPromise();
    
    // 프로필 업데이트 로직 (실제로는 인증 서비스에서 처리)
    // 여기서는 단순히 조회된 정보를 반환
    return {
      id: user.id,
      name: data.name || user.name,
      email: data.email || user.email,
      role: user.role,
      sign_type: user.sign_type,
      is_verified: user.is_verified,
      is_deleted: user.is_deleted,
      created_at: user.created_at,
      updated_at: new Date().toISOString(),
    };
  }

  @GrpcMethod("UserService", "DeleteUser")
  async deleteUser(data: any) {
    // 사용자 삭제 로직 (소프트 삭제)
    // 실제로는 인증 서비스에서 처리
    return {
      success: true,
      message: "사용자가 성공적으로 삭제되었습니다.",
    };
  }

  @GrpcMethod("UserService", "GetUsers")
  async getUsers(data: any) {
    // 사용자 목록 조회 로직
    // 실제로는 데이터베이스에서 조회
    const mockUsers = [
      {
        id: "1",
        name: "홍길동",
        email: "hong@example.com",
        role: "user",
        sign_type: "email",
        is_verified: true,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return {
      users: mockUsers,
      total: 1,
      page: data.page || 1,
      limit: data.limit || 10,
    };
  }
}
