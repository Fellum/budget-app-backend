import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'fellum',
      password: '123456',
    },
    {
      id: 2,
      username: 'lolg',
      password: '2121221',
    },
  ];

  async findOneByName(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
