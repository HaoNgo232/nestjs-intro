import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options/meta-options.service';
import { CreatePostMetaOptionsDto } from '../posts/dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public createMetaOptions(
    @Body() createPostMetaOptionDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionsService.create(createPostMetaOptionDto);
  }
}
