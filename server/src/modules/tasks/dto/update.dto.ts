import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from 'src/modules/tasks/dto/create.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
