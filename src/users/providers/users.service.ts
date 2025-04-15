/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public finAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number = 10,
    page: number = 1,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      {
        userId: 1,
        username: 'John Doe',
        email: 'WlL3t@example.com',
      },
      {
        userId: 2,
        username: 'Maximilian',
        email: 'WdfgW@example.com',
      },
      {
        userId: 3,
        username: 'Manuel',
        email: 'KXKkI@example.com',
      },
    ];
  }

  public findOneById(id: string) {
    return {
      userId: id,
      username: 'John Doe',
      email: 'WlL3t@example.com',
    };
  }
}
