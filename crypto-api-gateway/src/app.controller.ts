import { Controller, Get, Render } from '@nestjs/common';

@Controller('app')
export class AppController {

  @Get('home')
  @Render('home')
  async getTop10Coins() {
    return; // Pass data to the Handlebars template
  }

}
