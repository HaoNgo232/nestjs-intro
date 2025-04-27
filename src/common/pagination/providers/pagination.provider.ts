import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page || 1;
    const limit = paginationQuery.limit || 10;

    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    console.log('New URL:', newUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previosPage = page === 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${page}&limit=${limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${previosPage}&limit=${limit}`,
      },
    };

    return finalResponse;
  }
}
