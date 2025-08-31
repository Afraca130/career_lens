import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: "리프레시 토큰",
    example: "a1b2c3d4e5f6789...",
    type: "string",
  })
  @IsString({ message: "리프레시 토큰은 문자열이어야 합니다" })
  @IsNotEmpty({ message: "리프레시 토큰은 필수입니다" })
  readonly refresh_token: string;
}
