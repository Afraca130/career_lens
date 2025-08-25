import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { CreateUserUseCase } from '../../business/user/create-user.use-case';
import { GetUserUseCase } from '../../business/user/get-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return UserResponseDto.from(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.executeById(req.user.id);
    return UserResponseDto.from(user);
  }
}