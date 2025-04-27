/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';

@Controller('posts')
@ApiTags('Posts') // Swagger tag for the controller
export class PostsController {
  constructor(private readonly postsService: PostsService) {} // Injecting the PostsService

  @Get()
  public getPosts(@Query() postQuery: GetPostsDto) {
    return this.postsService.findPosts(postQuery);
  }

  @Get('/:userId')
  public getPostsByUserId(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    return this.postsService.findPostsByUserId(postQuery, userId);
  }

  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: CreatePostDto,
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Update a post',
    description: 'Update a post by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PatchPostDto,
  })
  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDto) {
    return this.postsService.update(patchPostsDto);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
