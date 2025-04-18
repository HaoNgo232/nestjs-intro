import {
  IsEmail,
  IsNotEmpty,
  IsString,
  // Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(96)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(96)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(96)
  // @Matches(/^[a-zA-Z0-9!@#$%^&*]{8,}$/, {
  //   message:
  //     'password must be at least 8 characters long and contain letters, numbers, and special characters',
  // })
  password: string;
}
