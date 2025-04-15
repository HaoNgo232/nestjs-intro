import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // Injecting the UsersService
  ) {}
  @Get(':id')
  getUser(
    @Param() getUsersParamDto?: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10)) limit?: number,
    @Query('page', new DefaultValuePipe(1)) page?: number,
  ) {
    return this.usersService.finAll(getUsersParamDto ?? {}, limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return 'This action creates a new user';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
