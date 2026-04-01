import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

type SortBy = 'createdAt' | 'dueDate' | 'status';

type SortOrder = 'asc' | 'desc';

type QuickFilter = 'active' | 'completed' | 'overdue';

export class QueryTasksDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  quickFilter?: QuickFilter;

  @IsOptional()
  sortBy?: SortBy;

  @IsOptional()
  sortOrder?: SortOrder;

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
