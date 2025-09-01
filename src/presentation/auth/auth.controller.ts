import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from "@nestjs/swagger";
import { AuthBusiness } from "../../business/auth/auth.business";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "../../domain/user/entity/user.entity";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authBusiness: AuthBusiness) {}

  @Post("signup")
  @ApiOperation({
    summary: "회원가입",
    description: "새로운 사용자를 등록합니다.",
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: "회원가입 성공",
    schema: {
      example: {
        _id: "507f1f77bcf86cd799439011",
        name: "홍길동",
        email: "user@example.com",
        role: "user",
        isDeleted: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 409, description: "이메일 중복" })
  @ApiResponse({ status: 400, description: "잘못된 요청 데이터" })
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    try {
      return await this.authBusiness.signup(signupDto);
    } catch (error) {
      if (error.message === "Email already exists") {
        throw new ConflictException("이미 존재하는 이메일입니다.");
      }
      throw error;
    }
  }

  @Post("login")
  @ApiOperation({ summary: "로그인", description: "사용자 인증을 수행합니다." })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "507f1f77bcf86cd799439011",
          email: "user@example.com",
          name: "홍길동",
          role: "user",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  @ApiResponse({ status: 400, description: "잘못된 비밀번호" })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authBusiness.login(loginDto);
    } catch (error) {
      if (error.message === "User not found") {
        throw new NotFoundException("사용자를 찾을 수 없습니다.");
      }
      if (error.message === "Invalid password") {
        throw new BadRequestException("잘못된 비밀번호입니다.");
      }
      throw error;
    }
  }

  @Post("verify")
  @ApiOperation({
    summary: "토큰 검증",
    description: "JWT 토큰의 유효성을 검증합니다.",
  })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer JWT 토큰",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "토큰 검증 성공",
    schema: {
      example: {
        userId: "507f1f77bcf86cd799439011",
        email: "user@example.com",
        type: "access",
        iat: 1640995200,
        exp: 1641081600,
      },
    },
  })
  @ApiResponse({ status: 401, description: "유효하지 않은 토큰" })
  async verifyToken(@Headers("authorization") authorization: string) {
    try {
      if (!authorization) {
        throw new UnauthorizedException("Authorization header is required");
      }

      return await this.authBusiness.verifyToken(authorization);
    } catch (error) {
      if (
        error.message.includes("Invalid or expired token") ||
        error.message.includes("Token is required")
      ) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
