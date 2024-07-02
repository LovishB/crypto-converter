import { Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { ConvertFiatDto } from './dtos/ConvertFiatDto';
import { lastValueFrom } from 'rxjs';
import { CostService } from './cost/cost.service';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private costService: CostService,
  ) {}

  @MessagePattern({ cmd: 'convertCoinToFiat' })
  async convertCoinToFiat(@Payload() convertFiatDto: ConvertFiatDto) {
    console.log(`getting converted Fiat of ${convertFiatDto.crypto}`);
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'getCurrentPrice' }, convertFiatDto),
    );
    if (!response) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return {
      crypto: convertFiatDto.crypto,
      fiat: convertFiatDto.fiat,
      current_pricing: response[convertFiatDto.crypto]?.[convertFiatDto.fiat] || 1,
      cost: this.costService.calculateCost(convertFiatDto, response)};
  }
}
