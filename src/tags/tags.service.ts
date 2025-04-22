/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;

  public async create(createTagDto: CreateTagDto) {
    let tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    let result = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });

    return result;
  }
}
