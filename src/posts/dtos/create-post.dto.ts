import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enums';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  title: string;

  @ApiProperty({
    description: 'The type of the post',
    enum: PostType,
    example: PostType.POST,
    enumName: 'PostType',
    required: true,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first-post',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and withoout spaces. For example "my-post"',
  })
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    description: 'The status of the post',
    enum: postStatus,
    example: postStatus.DRAFT,
    enumName: 'postStatus',
    required: true,
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'This is my first post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'The schema of the post',
    example: '{}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'The featured image url of the post',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  feeaturedImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The publish on date of the post',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  pulishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tag ids',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The meta value is a JSON string',
          example: '{"sidebarEnable": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
