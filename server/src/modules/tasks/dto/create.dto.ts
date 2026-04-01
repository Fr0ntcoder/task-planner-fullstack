import { Priority } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Введите название задачи' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Введите описание задачи' })
  description: string;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsEnum(Priority)
  priority: Priority;
}
