import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [MarketController],
})
export class MarketModule {}
