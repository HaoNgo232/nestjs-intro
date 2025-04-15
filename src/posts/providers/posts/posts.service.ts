import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAllPosts(userId?: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return [
      {
        userId: user,
        title: 'My first post',
        content: 'This is my first post',
      },
      {
        userId: user,
        title: 'My second post',
        content: 'This is my second post',
      },
      {
        userId: user,
        title: 'My third post',
        content: 'This is my third post',
      },
    ];
  }
}
