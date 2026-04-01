import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskModule } from 'src/modules/tasks/task.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TaskModule],
})
export class AppModule {}
