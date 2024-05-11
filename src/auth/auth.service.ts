import { randomBytes } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (!user) return null;
    const { passwordHash, ...result } = user;
    if (!(await this.usersService.checkPassword(password, passwordHash)))
      return null;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(48).toString('base64');
    await this.cacheManager.set(accessToken, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: any, accessToken: string, refreshToken: string) {
    const storedRefreshToken = await this.cacheManager.get<string>(accessToken);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Incorrect refresh token');
    }
    await this.cacheManager.del(accessToken);
    return this.login(user);
  }
}
