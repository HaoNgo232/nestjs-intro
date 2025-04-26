/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './providers/users.service';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
@ApiTags('Users') // Swagger tag for the controller
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // Injecting the UsersService
  ) {}
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetch a user by their unique ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: CreateUserDto,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of results',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  getUsers(@Param() getUsersParamDto?: GetUsersParamDto) {
    if (!getUsersParamDto || !getUsersParamDto.id) {
      return 'Please provide a valid user ID';
    }
    return this.usersService.findUserById(getUsersParamDto.id);
  }

  @Get()
  public getAllUsers(
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
  ) {
    try {
      return this.usersService.finAllUsers(limit, page);
    } catch (error) {
      return {
        message: 'Error occurred while fetching users',
        description: 'Error connecting to the database',
      };
    }
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    console.log('createManyUsersDto', createManyUsersDto);
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
