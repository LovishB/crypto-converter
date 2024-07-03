import { Controller } from '@nestjs/common';
import {
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
    private readonly supabaseService: SupabaseClientService,
  ) {}

  // Msg Handler for fetching top 10 coins and supported fiat
  @MessagePattern({ cmd: 'getTop10Coins' })
  async getTop10Coins(@Payload() data: {}) {
    // Calling Supabase database to read top coins and fiat data
    return this.supabaseService.readTableTopCoinsFiat();
  }
  
  // Msg Handler for getting current price of a coin
  @MessagePattern({ cmd: 'getCurrentPrice' })
  getCurrentPrice(@Payload() convertFiatDto: ConvertFiatDto) {
    // Calling MarketDataService to fetch current pricing for a specific coin and fiat from external API
    return this.marketDataService.getCoinPricing(
      convertFiatDto.crypto,
      convertFiatDto.fiat,
    );
  }

  // Event handler for receiving market data for scheduled tasks
  @EventPattern('getMarketData')
  async getMarketData(@Payload() req: { ids: string }) {
    // Calling MarketDataService to fetch market data for specified cryptos from external API
    return this.marketDataService.getMarketData(req.ids, true);
  }

  // Message handler for receiving real-time market data
  @MessagePattern({ cmd: 'getRealTimeData'})
  async getMarketDataMsg(@Payload() req: { ids: string }) {
    // Calling MarketDataService to fetch real-time market data for specified crypto from external API
    return this.marketDataService.getMarketData(req.ids, false);
  }

   // Msg Handler for fetching historical data of a coin
  @MessagePattern({ cmd: 'getHistoryOfCoin' })
  async getHistoryOfCoin(@Payload() data: { coin: string }) {
    // Calling Supabase database to read historical data for a specific coin
    return this.supabaseService.readTableMarketData(data.coin);
  }
}