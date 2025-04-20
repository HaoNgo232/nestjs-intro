/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from '../../../meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { metaOptions: _, ...dtoForPost } = createPostDto;

    const transformedDto = {
      ...dtoForPost,
      metaOptions: createPostDto.metaOptions
        ? { ...createPostDto.metaOptions }
        : undefined,
    };

    let post = this.postRepository.create(transformedDto);
    return this.postRepository.save(post);
  }

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

  public createPost(createPostDto: any) {
    // Here you would typically save the post to a database
    // For now, we'll just return the created post
    return createPostDto;
  }
}
