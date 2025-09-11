import { Controller, Post, Body, Headers } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from "@nestjs/swagger";
import { AuthApplicationService } from "../../../application/services/auth.application.service";
import { SignupDto } from "../dto/signup.dto";
import { LoginDto } from "../dto/login.dto";
import { SignupRequest } from "../../../application/use-cases/auth/dto/signup.request";
import { LoginRequest } from "../../../application/use-cases/auth/dto/login.request";
import { RefreshTokenRequest } from "../../../application/use-cases/auth/dto/refresh-token.request";
@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authApplicationService: AuthApplicationService
  ) {}

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
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    const request = new SignupRequest(
      signupDto.name,
      signupDto.email,
      signupDto.password,
      signupDto.signType
    );
    return await this.authApplicationService.signup(request);
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
    const request = new LoginRequest(loginDto.email, loginDto.password);
    return await this.authApplicationService.login(request);
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
    if (!authorization) {
      throw new Error("Authorization header is required");
    }

    return await this.authApplicationService.verifyToken(authorization);
  }

  @Post("refresh")
  @ApiOperation({
    summary: "토큰 갱신",
    description: "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        refresh_token: {
          type: "string",
          description: "Refresh Token",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
      required: ["refresh_token"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "토큰 갱신 성공",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  })
  @ApiResponse({ status: 401, description: "유효하지 않은 Refresh Token" })
  async refreshToken(@Body() body: { refresh_token: string }) {
    const request = new RefreshTokenRequest(body.refresh_token);
    return await this.authApplicationService.refreshToken(request);
  }
}
