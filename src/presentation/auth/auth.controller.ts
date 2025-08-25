import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { GenerateTokenUseCase } from '../../business/auth/generate-token.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly generateTokenUseCase: GenerateTokenUseCase) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const authResult = this.generateTokenUseCase.execute(req.user);
    return AuthResponseDto.from(authResult);
  }
}