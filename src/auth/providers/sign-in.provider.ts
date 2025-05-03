/* eslint-disable prefer-const */
import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // Find the user by email
    // Throw an error if the user is not found
    let user = await this.userService.findOneByEmail(signInDto.email);

    // Compare the password with the hashed password
    let isEqual: boolean = false;
    try {
      if (!user.password) {
        throw new UnauthorizedException('Invalid user credentials');
      }
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
