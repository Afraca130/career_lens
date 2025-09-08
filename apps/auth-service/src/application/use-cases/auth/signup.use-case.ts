import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { IAuthService } from "../../../domain/auth/auth.service.interface";
import { User } from "../../../domain/user/entity/user.domain";
import { SignupRequest } from "./signup.request";
import { SignupResponse } from "./signup.response";
import { EmailAlreadyExistsException } from "../../../domain/auth/exceptions";

/**
 * 회원가입 유스케이스
 * 비즈니스 로직을 캡슐화하고 도메인 규칙을 적용
 */
@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(request: SignupRequest): Promise<SignupResponse> {
    // 1. 이메일 중복 검증
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(request.email);
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await this.authService.hashPassword(request.password);

    // 3. 사용자 도메인 객체 생성
    const user = User.create(
      request.name,
      request.email,
      hashedPassword,
      request.signType || "email"
    );

    // 4. 사용자 저장
    const savedUser = await this.userRepository.create(user);

    // 5. 응답 생성
    return new SignupResponse(
      savedUser.id,
      savedUser.name,
      savedUser.email,
      savedUser.role,
      savedUser.signType,
      savedUser.isVerified,
      savedUser.createdAt
    );
  }
}
