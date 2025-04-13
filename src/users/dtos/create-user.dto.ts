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
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(/^[a-zA-Z0-9!@#$%^&*]{8,}$/, {
  //   message:
  //     'password must be at least 8 characters long and contain letters, numbers, and special characters',
  // })
  password: string;
}
