import {
  Body,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/tags.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { User } from '../../users/user.entity';
import { Tag } from '../../tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly usersService: UsersService,

    private readonly tagService: TagsService,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | null;
    let tags: Tag[] | null;
    try {
      author = await this.usersService.findOneById(user.sub);

      tags = await this.tagService.findMultipleTags(createPostDto.tags || []);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new RequestTimeoutException('Please check your tag Ids');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { metaOptions: _, ...dtoForPost } = createPostDto;

    const transformedDto = {
      ...dtoForPost,
      metaOptions: createPostDto.metaOptions
        ? { ...createPostDto.metaOptions }
        : undefined,
    };

    const post = this.postsRepository.create({
      ...transformedDto,
      author,
      tags,
    });

    try {
      return this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not save post',
      });
    }
  }
}
