import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksService } from './scheduled-tasks/scheduled-tasks.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [ScheduleModule.forRoot(), NatsClientModule],
  providers: [ScheduledTasksService],
})
export class SchedulerModule {}
