import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '유효한 이메일 형식을 입력해주세요.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  password: string;
}