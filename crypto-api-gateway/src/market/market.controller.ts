import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Query,
  Render,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('market-data')
export class MarketController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  //Retirive top 10 coins based on their market cap
  @Get('converter')
  @Render('getTop10Coins')
  async getTop10Coins() {
    const topCrypto = await lastValueFrom(
      this.natsClient.send({ cmd: 'getTop10Coins' }, {}),
    );
    if (!topCrypto) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const fiats = ['usd', 'inr']; // Static fiat currencies
    const supportedCurrency = await lastValueFrom(
      this.natsClient.send({ cmd: 'getSupportedCurrency' }, {}),
    );
    if (!topCrypto) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { topCrypto, fiats: supportedCurrency }; // Pass data to the Handlebars template
  }

  //Retirive realtime exchange rates
  @Get('getRates')
  async getExchangeRates() {
    const rates = await lastValueFrom(
      this.natsClient.send({ cmd: 'getRates' }, {}),
    );
    if (!rates) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return rates;
  }

  //Get Coins with Stored Historical Data
  @Get('gethistory')
  @Render('getHistory')
  async getHistory() {
    const cryptocurrencies = await lastValueFrom(
      this.natsClient.send({ cmd: 'getTop10Coins' }, {}),
    );
    if (!cryptocurrencies) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { cryptocurrencies };
  }

  //Get Historical Data of market cap of a coin
  @Get('historyData')
  @Render('historyData') // Render the 'historyData' view template
  async getHistoryOfCoin(@Query('selectedCrypto') selectedCrypto: string) {
    console.log(`Getting history data of ${selectedCrypto}`);
    const data = await lastValueFrom(
      this.natsClient.send({ cmd: 'getHistoryOfCoin' }, { coin: selectedCrypto }),
    );
    if (!data) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { marketData: data, selectedCrypto }; // Pass fetched data to the view template
  }
}
