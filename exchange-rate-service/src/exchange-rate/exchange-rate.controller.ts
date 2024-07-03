import { Controller, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { ConvertFiatDto } from "./dtos/ConvertFiatDto";
import { lastValueFrom } from "rxjs";
import { CostService } from "./cost/cost.service";

@Controller("exchange-rate")
export class ExchangeRateController {
  constructor(
    @Inject("NATS_SERVICE") private natsClient: ClientProxy,
    private costService: CostService,
  ) {}

  /**
   * Controller endpoint to handle the conversion of cryptocurrency to fiat currency.
   * @param convertFiatDto DTO containing details for the conversion (crypto, fiat, total coins).
   * @returns Object with details of converted fiat value and calculated cost.
   * @throws HttpException if conversion data is not found.
   */
  @MessagePattern({ cmd: "convertCoinToFiat" })
  async convertCoinToFiat(@Payload() convertFiatDto: ConvertFiatDto) {
    console.log(`Getting converted Fiat of ${convertFiatDto.crypto}`);

    // Fetch current cryptocurrency prices from NATS microservice
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: "getCurrentPrice" }, convertFiatDto),
    );
    if (!response) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    // Return object to api-gateway with conversion details and calculated cost
    return {
      crypto: convertFiatDto.crypto,
      fiat: convertFiatDto.fiat,
      current_pricing:
        response[convertFiatDto.crypto]?.[convertFiatDto.fiat] || 1,
      cost: this.costService.calculateCost(convertFiatDto, response),
    };
  }
}
