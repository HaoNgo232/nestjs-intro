/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  public login(email: string, password: string, id: number) {
    const user = this.userService.findOneById(123);
    return 'Sample_Token';
  }

  public isAuth() {
    return true;
  }
}
