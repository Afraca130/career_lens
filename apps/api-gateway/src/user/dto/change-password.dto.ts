import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ example: "newpassword123", description: "새 비밀번호" })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
