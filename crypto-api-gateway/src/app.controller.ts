import { Controller, Get, HttpException, HttpStatus, Inject, Render } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('app')
export class AppController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
  
  @Get('home')
  @Render('home')
  async getTop10Coins() {
    const topCrypto = await lastValueFrom(
      this.natsClient.send({ cmd: 'getTop10Coins' }, {}),
    );
    if (!topCrypto) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return { cryptocurrencies: topCrypto }// Pass data to the Handlebars template
  }

}
