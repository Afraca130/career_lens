import { IsEmail, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  @IsString()
  name: string;

  @ApiProperty({ example: "user@example.com", description: "사용자 이메일" })
  @IsEmail()
  email: string;
}
