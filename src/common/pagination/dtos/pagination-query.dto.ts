import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // Can remove if using transformOptions on main.ts
  limit?: number = 10; // Default value

  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // Can remove if using transformOptions on main.ts
  page?: number = 1; // Default value
}
