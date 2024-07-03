import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CRYPTO_LIST } from "src/constants/exchange-rate.constants";

@Injectable()
export class ScheduledTasksService {
  /**
   * Service responsible for scheduling tasks using cron jobs.
   * Uses NestJS Scheduler to execute a task every day at midnight to fetch market data.
   * Uses NATS microservice for event-driven communication.
   */

  constructor(@Inject("NATS_SERVICE") private natsClient: ClientProxy) {}

  // Run the Scheduled task on app startup
  onApplicationBootstrap() {
    this.handleCron();
  }

  // Scheduled cron job to run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    console.log("Started Sceduled Task");

    // List of cryptocurrencies to fetch market data for
    const cryptos = CRYPTO_LIST;

    // Emit an event to NATS microservice to fetch market data for specified cryptocurrencies
    try {
      this.natsClient.emit("getMarketData", { ids: cryptos });
    } catch (error) {
      console.error("Error sending event:", error.message);
    }
  }
}
