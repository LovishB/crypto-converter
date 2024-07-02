import { Module } from '@nestjs/common';
import { NatsClientModule } from './nats-client/nats-client.module';
import { MarketModule } from './market/market.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [NatsClientModule, MarketModule, SupabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
