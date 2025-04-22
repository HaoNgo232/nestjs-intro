/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (!existingUser) {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      return newUser;
    } else {
      return 'User already exists';
    }
  }

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

  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
