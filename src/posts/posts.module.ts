import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts/posts.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [UsersModule],
})
export class PostsModule {}
