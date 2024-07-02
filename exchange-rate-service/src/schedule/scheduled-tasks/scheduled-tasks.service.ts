import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Console } from 'console';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ScheduledTasksService {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // Run the task on startup
  onApplicationBootstrap() {
    this.handleCron();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    console.log('Started Sceduled Task');
    try {
      this.natsClient.emit('getMarketData', { ids: 'bitcoin,solana' });
    } catch (error) {
      console.error('Error sending event:', error.message);
    }
  }
}
