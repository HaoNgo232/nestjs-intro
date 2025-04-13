import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  //   @Get()
  //   getAllUsers() {
  //     return 'This action returns all users';
  //   }

  @Get(':id')
  getUser(
    @Param('id', ParseIntPipe) id?: number,
    @Query('limit', ParseIntPipe, new DefaultValuePipe(10)) limit?: number,
    @Query('page', ParseIntPipe, new DefaultValuePipe(1)) page?: number,
  ): string {
    console.log(typeof id);
    console.log(limit);
    console.log(page);
    return `This action returns a ${id} user`;
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action creates a new user';
  }
}
