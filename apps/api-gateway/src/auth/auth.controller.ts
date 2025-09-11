import { Controller, Post, Body, Headers } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from "@nestjs/swagger";
import { UserGrpcClient } from "../user/user-grpc.client";
import { SignupDto } from "../user/dto/signup.dto";
import { LoginDto } from "../user/dto/login.dto";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly userGrpcClient: UserGrpcClient) {}

  @Post("register")
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
        id: "73b19f19-9254-4c39-92bd-bd9c48ff455e",
        name: "홍길동",
        email: "user@example.com",
        role: "user",
        signType: "email",
        isVerified: false,
        createdAt: "2025-09-11T08:04:07.185Z",
      },
    },
  })
  @ApiResponse({ status: 409, description: "이메일 중복" })
  @ApiResponse({ status: 400, description: "잘못된 요청 데이터" })
  async register(@Body() signupDto: SignupDto) {
    return this.userGrpcClient.signup({
      name: signupDto.name,
      email: signupDto.email,
      password: signupDto.password,
      signType: signupDto.signType,
    });
  }

  @Post("login")
  @ApiOperation({
    summary: "로그인",
    description: "사용자 인증을 수행합니다.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "73b19f19-9254-4c39-92bd-bd9c48ff455e",
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
    return this.userGrpcClient.login({
      email: loginDto.email,
      password: loginDto.password,
    });
  }

  @Post("verify-token")
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
        userId: "73b19f19-9254-4c39-92bd-bd9c48ff455e",
        email: "user@example.com",
        type: "access",
        iat: 1757577854,
        exp: 1757664254,
      },
    },
  })
  @ApiResponse({ status: 401, description: "유효하지 않은 토큰" })
  async verifyToken(@Headers("authorization") authorization: string) {
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authorization header is required");
    }
    return this.userGrpcClient.verifyToken({ token });
  }

  @Post("refresh-token")
  @ApiOperation({
    summary: "토큰 갱신",
    description: "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          description: "Refresh Token",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
      required: ["refreshToken"],
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
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.userGrpcClient.refreshToken({
      refreshToken: body.refreshToken,
    });
  }
}

