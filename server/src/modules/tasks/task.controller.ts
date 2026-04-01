import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { QueryTasksDto } from 'src/modules/tasks/dto/query.dto';
import { TaskService } from 'src/modules/tasks/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Query() query: QueryTasksDto) {
    return this.taskService.findAll(query);
  }
}
