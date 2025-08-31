import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpStatus,
  UseFilters,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { GenerateTokenUseCase } from "../../business/auth/generate-token.use-case";
import { RefreshTokenUseCase } from "../../business/auth/refresh-token.use-case";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponseDto } from "./dto/refresh-token-response.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { AuthExceptionFilter } from "../filters/auth-exception.filter";

@ApiTags("인증")
@Controller("auth")
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @ApiOperation({ summary: "로그인" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "인증 실패",
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @Request() req,
    @Body() loginDto: LoginDto
  ): Promise<AuthResponseDto> {
    const authResult = await this.generateTokenUseCase.execute(req.user);
    return AuthResponseDto.from(authResult);
  }

  @ApiOperation({
    summary: "액세스 토큰 갱신",
    description:
      "리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급받습니다",
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: "리프레시 토큰 정보",
  })
  @ApiCreatedResponse({
    description: "토큰 갱신 성공",
    type: RefreshTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: "잘못된 요청 데이터",
  })
  @ApiUnauthorizedResponse({
    description: "유효하지 않은 리프레시 토큰",
  })
  @ApiInternalServerErrorResponse({
    description: "서버 내부 오류",
  })
  @Post("refresh")
  async refresh(
    @Body() refreshTokenDto: RefreshTokenRequestDto
  ): Promise<RefreshTokenResponseDto> {
    const refreshTokenResult = await this.refreshTokenUseCase.execute({
      refreshToken: refreshTokenDto.refresh_token,
    });
    return RefreshTokenResponseDto.from(refreshTokenResult);
  }
}
