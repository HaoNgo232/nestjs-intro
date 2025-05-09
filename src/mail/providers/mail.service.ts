import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendUserWelcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <support@example.com>`,
      subject: 'Welcome to NestJS Blog!',
      template: './welcome',
      context: {
        name: user.username,
        email: user.email,
        loginUrl: 'http://localhost:3000',
      },
    });
  }
}
