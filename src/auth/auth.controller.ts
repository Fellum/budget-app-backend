import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  async getMe(@Request() req) {
    return req.user;
  }
}
