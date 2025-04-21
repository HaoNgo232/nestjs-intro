/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    private readonly postsRepository: Repository<Post>,

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

    let post = this.postsRepository.create(transformedDto);
    return this.postsRepository.save(post);
  }

  public async findAll(userId?: string) {
    if (userId) {
      // Logic để tìm tất cả bài viết của người dùng có userId
      return `Posts for user ${userId}`;
    } else {
      // Logic để tìm tất cả bài viết
      const posts = await this.postsRepository.find({
        relations: {
          metaOptions: true, // This will load the metaOptions for each post - apply for this method
        },
      });
      return posts;
    }
  }

  public createPost(createPostDto: any) {
    // Here you would typically save the post to a database
    // For now, we'll just return the created post
    return createPostDto;
  }

  public async delete(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let post = await this.postsRepository.findOneBy({ id });
    await this.postsRepository.delete(id);
    if (post && post.metaOptions) {
      await this.metaOptionsRepository.delete(post.metaOptions.id);
      return { deleted: true, id };
    } else {
      return { deleted: false, id };
    }
  }
}
