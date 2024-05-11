import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    response.cookie('refresh_token', refreshToken);
    return { access_token: accessToken };
  }

  @Get('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const refreshToken = req.cookies['refresh_token'];
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(req.user, accessToken, refreshToken);
    response.cookie('refresh_token', newRefreshToken);
    return { access_token: newAccessToken };
  }

  @Get('profile')
  async getMe(@Req() request: Request) {
    return request.user;
  }
}
