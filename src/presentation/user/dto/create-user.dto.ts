import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 형식을 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 (최소 6자)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({
    description: '사용자 이름 (선택사항)',
    example: '홍길동',
    required: false,
  })
  @IsOptional()
  name?: string;
}