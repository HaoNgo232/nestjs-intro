import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from '../../../users/providers/users.service';
import { GenerateTokensProvider } from '../../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfigguration.googleClientId;
    const clientSecret = this.jwtConfigguration.googleClientSecret;
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // Verify Google token sent by user
      const loginTicket = await this.oauth2Client.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // Extract the payload from Google JWt
      const payload = loginTicket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token: payload is null');
      }
      const { email, sub: googleId, given_name: username } = payload;

      if (!email) {
        throw new Error('Invalid Google token: email is required');
      }

      if (!username) {
        throw new Error('Invalid Google token: username is required');
      }

      // Find the user in the database using the GoogleId
      const user = await this.userService.findOneByGoogleId(googleId);
      // If googleId exists, generate token
      if (user) {
        return this.generateTokensProvider.generateTokens(user);
      }
      // If not exists, create a new user then generate token
      const newUser = await this.userService.createGoogleUser({
        email: email,
        username: username,
        googleId: googleId,
      });
      // Generate token for the new user
      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      // Handle errors
      throw new UnauthorizedException(error);
    }
  }
}
