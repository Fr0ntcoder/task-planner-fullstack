import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum SortBy {
  createdAt = 'createdAt',
  dueDate = 'dueDate',
  status = 'status',
}

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

enum QuickFilter {
  active = 'active',
  completed = 'completed',
  overdue = 'overdue',
}

export class QueryTasksDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsEnum(QuickFilter)
  quickFilter?: QuickFilter;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.createdAt;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.desc;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
