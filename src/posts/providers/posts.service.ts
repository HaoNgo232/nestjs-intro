/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from '../../meta-options/meta-options.entity';
import { TagsService } from '../../tags/tags.service';
import { Tag } from '../../tags/tag.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,

    private readonly tagService: TagsService,

    private readonly paginationProvider: PaginationProvider,

    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return this.createPostProvider.create(createPostDto, user);
  }

  public async findPosts(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const { page, limit } = postQuery;
    let posts = await this.paginationProvider.paginateQuery(
      {
        page,
        limit,
      },
      this.postsRepository,
    );
    return posts;
  }

  public async findPostsByUserId(postQuery: GetPostsDto, userId: string) {
    // Logic để tìm tất cả bài viết
    const page = postQuery.page ?? 1;
    const limit = postQuery.limit ?? 10;

    const posts = await this.postsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return posts;
  }

  public createPost(createPostDto: any) {
    // Here you would typically save the post to a database
    // For now, we'll just return the created post
    return createPostDto;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] | null = null;
    let post: Post | null = null;
    try {
      tags = await this.tagService.findMultipleTags(patchPostDto.tags || []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    if (!tags || patchPostDto.tags?.length !== tags.length) {
      throw new BadRequestException(
        'Please check your yag Ids and ensure they are carrect',
      );
    }

    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('Post ID does not found');
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.feeaturedImageUrl =
      patchPostDto.feeaturedImageUrl ?? post.feeaturedImageUrl;
    post.pulishOn = patchPostDto.pulishOn ?? post.pulishOn;

    post.tags = tags;

    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return post;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
