import {
  Controller,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UserBusiness } from "../../business/user/user.business";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { User } from "../../domain/user/entity/user.entity";

@ApiTags("사용자")
@Controller("users")
export class UserController {
  constructor(private readonly userBusiness: UserBusiness) {}

  @Post(":userId/change-password")
  @ApiOperation({
    summary: "비밀번호 변경",
    description:
      "사용자의 비밀번호를 변경합니다. (kakao, naver 가입자는 변경 불가)",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: "비밀번호 변경 성공",
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "홍길동",
        email: "user@example.com",
        role: "user",
        signType: "email",
        isVerified: false,
        isDeleted: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "비밀번호 변경 불가 또는 잘못된 요청",
  })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async changePassword(
    @Param("userId") userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<User> {
    return await this.userBusiness.changePassword({
      userId,
      newPassword: changePasswordDto.newPassword,
    });
  }
}
