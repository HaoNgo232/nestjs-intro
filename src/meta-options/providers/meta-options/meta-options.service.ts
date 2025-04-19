/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../../../posts/dtos/create-post-meta-options.dto';
import { MetaOptions } from '../../meta-options.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptions)
    private readonly metaOptionsRepository: Repository<MetaOptions>,
  ) {}

  public async create(createMetaOptionsDto: CreatePostMetaOptionsDto) {
    let metaOption = this.metaOptionsRepository.create(createMetaOptionsDto);
    return await this.metaOptionsRepository.save(metaOption);
  }
}
