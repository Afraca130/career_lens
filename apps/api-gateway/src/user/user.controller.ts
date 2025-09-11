import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Headers,
  Query,
  UseGuards,
  Param,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UserGrpcClient } from "./user-grpc.client";
import { AuthGuard } from "./auth.guard";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { GetUsersDto } from "./dto/get-users.dto";

@ApiTags("사용자")
@Controller("users")
export class UserController {
  constructor(private readonly userGrpcClient: UserGrpcClient) {}

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "내 정보 조회",
    description: "현재 로그인한 사용자의 정보를 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "사용자 정보 조회 성공",
  })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async getMyInfo(@Headers("user-id") userId: string) {
    return this.userGrpcClient.getUser({ userId });
  }

  @Put("change-password")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "비밀번호 변경",
    description: "현재 로그인한 사용자의 비밀번호를 변경합니다.",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: "비밀번호 변경 성공",
  })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async changePassword(
    @Headers("user-id") userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.userGrpcClient.changePassword({
      userId,
      newPassword: changePasswordDto.newPassword,
    });
  }

  @Put("profile")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "프로필 업데이트",
    description: "사용자 프로필 정보를 업데이트합니다.",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: "프로필 업데이트 성공",
  })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async updateProfile(
    @Headers("user-id") userId: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.userGrpcClient.updateProfile({
      userId,
      name: updateProfileDto.name,
      email: updateProfileDto.email,
    });
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "사용자 삭제",
    description: "사용자를 삭제합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "사용자 삭제 성공",
  })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async deleteUser(@Param("id") userId: string) {
    return this.userGrpcClient.deleteUser({ userId });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "사용자 목록 조회",
    description: "사용자 목록을 조회합니다.",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "사용자 목록 조회 성공",
  })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  async getUsers(@Query() query: GetUsersDto) {
    return this.userGrpcClient.getUsers({
      page: query.page || 1,
      limit: query.limit || 10,
      search: query.search || "",
    });
  }
}
