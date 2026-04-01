import { Module } from '@nestjs/common';
import { TaskController } from 'src/modules/tasks/task.controller';
import { TaskService } from 'src/modules/tasks/task.service';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
