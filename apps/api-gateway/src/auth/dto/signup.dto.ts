import { IsEmail, IsString, IsOptional, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  @IsString()
  name: string;

  @ApiProperty({ example: "user@example.com", description: "사용자 이메일" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", description: "비밀번호" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "email", description: "가입 방식", required: false })
  @IsOptional()
  @IsString()
  signType?: string = "email";
}
