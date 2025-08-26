import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GenerateTokenUseCase } from '../../business/auth/generate-token.use-case';
import { RefreshTokenUseCase } from '../../business/auth/refresh-token.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const authResult = await this.generateTokenUseCase.execute(req.user);
    return AuthResponseDto.from(authResult);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 리프레시 토큰',
  })
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const authResult = await this.refreshTokenUseCase.execute(refreshTokenDto.refresh_token);
    return AuthResponseDto.from(authResult);
  }
}