import { Module } from "@nestjs/common";
import { ExchangeRateModule } from "./exchange-rate/exchange-rate.module";
import { NatsClientModule } from "./nats-client/nats-client.module";
import { SchedulerModule } from "./schedule/scheduler.module";

@Module({
  imports: [ExchangeRateModule, NatsClientModule, SchedulerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
