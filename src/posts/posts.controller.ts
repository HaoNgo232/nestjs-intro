import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {} // Injecting the PostsService

  @Get('/:userId')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAllPosts(userId);
  }
}
