import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Render,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("app")
export class AppController {
  constructor(@Inject("NATS_SERVICE") private natsClient: ClientProxy) {}

  // Handler for GET request to "/app/home"
  @Get("home")
  @Render("home")
  async homePage() {
    // Sending request to the crypto-market microservice to get top 10 coins and fiats
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: "getTop10Coins" }, {}),
    );
    if (!response) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    // Find the cryptocurrency response from the microservice
    const cryptoResponse = response.find(
      (item) => item.currency_type === "crypto",
    );
    const topCrypto = cryptoResponse ? cryptoResponse.value.split(",") : [];

    // Pass data to the Handlebars template
    return { cryptocurrencies: topCrypto };
  }
}
