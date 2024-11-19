import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/AuthGuard';
import { Public } from 'src/common/decorators/publicDecorator.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {

    const { token, user } = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
        roles: user.roles  // Include only the role names
      },
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
