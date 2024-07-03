import { Module } from "@nestjs/common";
import { NatsClientModule } from "./nats-client/nats-client.module";
import { ExchangeRateModule } from "./exchange-rate/exchange-rate.module";
import { MarketModule } from "./market/market.module";
import { AppController } from "./app.controller";

@Module({
  imports: [NatsClientModule, ExchangeRateModule, MarketModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
