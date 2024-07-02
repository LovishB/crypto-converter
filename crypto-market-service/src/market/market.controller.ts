import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { MarketDataService } from './market-data/market-data.service';
import { ConvertFiatDto } from './dtos/ConvertFiatDto';
import { SupabaseClientService } from 'src/supabase/supabase-client/supabase-client.service';

@Controller('market')
export class MarketController {
  constructor(
    private marketDataService: MarketDataService,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private readonly supabaseService: SupabaseClientService,
  ) {}

  //Retirive top 10 coins based on their market cap
  @MessagePattern({ cmd: 'getTop10Coins' })
  getTop10Coins(@Payload() data: {}) {
    return this.marketDataService.getTop10Coins();
  }

  //Retirive supportedCurrency of coin gecko
  @MessagePattern({ cmd: 'getSupportedCurrency' })
  getSupportedCurrency(@Payload() data: {}) {
    return this.marketDataService.getSupportedCurrency();
  }

  //Get Current Price of a coin
  @MessagePattern({ cmd: 'getCurrentPrice' })
  getCurrentPrice(@Payload() convertFiatDto: ConvertFiatDto) {
    return this.marketDataService.getCoinPricing(
      convertFiatDto.crypto,
      convertFiatDto.fiat,
    );
  }

  //event: market data for sceduled task
  @EventPattern('getMarketData')
  async getMarketData(@Payload() req: { ids: string }) {
    const marketData = this.marketDataService.getMarketData(req.ids);
    return marketData;
  }

  //Get History Data of a coin
  @MessagePattern({ cmd: 'getHistoryOfCoin' })
  async getHistoryOfCoin(@Payload() data: { coin: string }) {
    const supabase = this.supabaseService.getClient();
    return (
      await supabase
        .from('market-data')
        .select('*')
        .eq('crypto_name', data.coin)
    ).data;
  }
}
