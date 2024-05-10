import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createSaltAndPasswordHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return { hash };
  }

  async checkPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  async findOneByName(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }
}
