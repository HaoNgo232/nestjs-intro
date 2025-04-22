/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/providers/users.service';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from '../../../meta-options/meta-options.entity';
import { TagsService } from '../../../tags/tags.service';
import { Tag } from '../../../tags/tag.entity';
import { PatchPostDto } from '../../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,

    private readonly tagService: TagsService,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    let author = await this.usersService.findOneById(createPostDto.authorId);

    if (!author) {
      throw new Error('Author is required');
    }

    const tags = await this.tagService.findMultipleTags(
      createPostDto.tags || [],
    );

    const { metaOptions: _, ...dtoForPost } = createPostDto;

    const transformedDto = {
      ...dtoForPost,
      metaOptions: createPostDto.metaOptions
        ? { ...createPostDto.metaOptions }
        : undefined,
    };

    let post = this.postsRepository.create({
      ...transformedDto,
      author,
      tags,
    });
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
          // author: true,
          // tags: true,
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
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags = await this.tagService.findMultipleTags(patchPostDto.tags || []);

    // Find the post by ID
    let post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    if (!post) {
      throw new Error('Post not found');
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

    return this.postsRepository.save(post);
  }
}
