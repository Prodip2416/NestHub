import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {

    const { token, user } = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      data: { ...user, token },
    };
  }

  @Get('user-info')
  @HttpCode(HttpStatus.OK)
  async userInfo(@Body() userToken: string) {

    const user = await this.authService.getUserFromToken(userToken);
    return {
      message: 'User info get successful',
      data: user,
    };
  }
}
