import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { CostService } from './cost/cost.service';

@Module({
  imports: [NatsClientModule],
  controllers: [ExchangeRateController],
  providers: [CostService],
})
export class ExchangeRateModule {}
