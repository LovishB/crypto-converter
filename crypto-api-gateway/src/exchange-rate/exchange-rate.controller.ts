import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Render,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { ConvertFiatDto } from "./dtos/ConvertFiatDto";

@Controller("exchange-rate")
export class ExchangeRateController {
  constructor(@Inject("NATS_SERVICE") private natsClient: ClientProxy) {}

  // POST handler for converting crypto to fiat
  @Post("convertCoinToFiat")
  @Render("convertCoinToFiat")
  async convertCoinToFiat(@Body() convertFiatDto: ConvertFiatDto) {
    console.log(
      `Converting crypto ${convertFiatDto.crypto}  to ${convertFiatDto.fiat}`,
    );

    // Send request to exchange-microservice to convert crypto to selected fiat
    const convertedPrice = await lastValueFrom(
      this.natsClient.send({ cmd: "convertCoinToFiat" }, convertFiatDto),
    );
    if (!convertedPrice)
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    // Pass data to the Handlebars template
    return {
      crypto: convertedPrice.crypto,
      fiat: convertedPrice.fiat,
      current_pricing: convertedPrice.current_pricing,
      cost: convertedPrice.cost,
    };
  }
}
