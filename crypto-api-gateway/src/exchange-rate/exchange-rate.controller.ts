import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Render,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ConvertFiatDto } from './dtos/ConvertFiatDto';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  //Retirive top crypto based on market cap
  @Post('convertCoinToFiat')
  @Render('convertCoinToFiat')
  async convertCoinToFiat(@Body() convertFiatDto: ConvertFiatDto) {
    const convertedPrice = await lastValueFrom(
      this.natsClient.send({ cmd: 'convertCoinToFiat' }, convertFiatDto),
    );
    if (!convertedPrice)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return {
      crypto: convertedPrice.crypto,
      fiat: convertedPrice.fiat,
      current_pricing: convertedPrice.current_pricing,
      cost: convertedPrice.cost,
    }; // Pass data to the Handlebars template
  }
}
