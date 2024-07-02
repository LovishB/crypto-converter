import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}
