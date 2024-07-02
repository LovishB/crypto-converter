import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { MarketDataService } from './market-data/market-data.service';
import { HttpModule } from '@nestjs/axios';
import { SupabaseClientService } from 'src/supabase/supabase-client/supabase-client.service';

@Module({
  imports: [NatsClientModule, HttpModule],
  controllers: [MarketController],
  providers: [MarketDataService, SupabaseClientService],
})
export class MarketModule {}
