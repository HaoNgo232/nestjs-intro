import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateManyUsersDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'User',
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  @IsNotEmpty()
  @IsArray()
  users: CreateUserDto[];
}
