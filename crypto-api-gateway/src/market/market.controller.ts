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
    const supportedCurrency = await lastValueFrom(
      this.natsClient.send({ cmd: 'getSupportedCurrency' }, {}),
    );
    if (!topCrypto) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { topCrypto, fiats: supportedCurrency }; // Pass data to the Handlebars template
  }

  //Get Historical Data of market cap of a coin
  @Get('historyData')
  @Render('historyData')
  async getHistoryOfCoin(@Query('selectedCrypto') selectedCrypto: string) {
    console.log(`Getting history data of ${selectedCrypto}`);
    const historicalData = await this.getHistoryData(selectedCrypto);
    return { marketData: historicalData, selectedCrypto }; // Pass fetched data to the view template
  }

  //Get 24 Hr Change Chart
  @Get('get24Chart')
  @Render('get24Chart')
  async get24Chart(@Query('selectedCrypto') selectedCrypto: string) {
    console.log(`Getting history data of ${selectedCrypto}`);
    const historicalData = await this.getHistoryData(selectedCrypto);
    return { tableData: historicalData, data: JSON.stringify(historicalData) };// Pass fetched data to the view template
  }

  private async getHistoryData(selectedCrypto: string) {
    const historicalData = await lastValueFrom(
      this.natsClient.send({ cmd: 'getHistoryOfCoin' }, { coin: selectedCrypto }),
    );
    if (!historicalData) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return historicalData;
  } 

  //Retrive Real Time Market data of a coin
  @Get('getRealTimeData')
  @Render('getRealTimeData')
  async getRealTimeData(@Query('selectedCrypto') selectedCrypto: string) {
    console.log(`Getting history data of ${selectedCrypto}`);
    const realTimeData = await lastValueFrom(
      this.natsClient.send({ cmd: 'getRealTimeData' }, { ids: selectedCrypto }),
    );
    if (!realTimeData) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { crypto: realTimeData };// Pass fetched data to the view template
  }

}
