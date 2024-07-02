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
    const cryptos = 'bitcoin,ethereum,binancecoin,solana,the-open-network,cardano,avalanche-2,tron,bitcoin-cash,near';
    try {
      this.natsClient.emit('getMarketData', { ids: cryptos });
    } catch (error) {
      console.error('Error sending event:', error.message);
    }
  }
}
