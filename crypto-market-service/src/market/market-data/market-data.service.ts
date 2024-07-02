import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CoinGeckoConfig } from 'src/config/coingecko-config';
import { SupabaseClientService } from 'src/supabase/supabase-client/supabase-client.service';

@Injectable()
export class MarketDataService {
  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseClientService,
  ) {}

  async getTop10Coins(): Promise<void> {
    try {
      console.log('Calling coin gecko markets api');
      const response = await firstValueFrom(
        this.httpService.get(`${CoinGeckoConfig.baseURL}/coins/markets`, {
          headers: CoinGeckoConfig.headers,
          params: CoinGeckoConfig.top10CoinsParams,
        }),
      );

      const top10Coins = response.data.map((crypto) => ({
        crypto_id: crypto.id,
      }));
      return top10Coins;
    } catch (error) {
      console.error('Error fetching data from NATS:', error.message);
      throw new HttpException('Failed to fetch data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSupportedCurrency(): Promise<void> {
    try {
      console.log('Calling coin gecko markets api');
      const response = await firstValueFrom(
        this.httpService.get(`${CoinGeckoConfig.baseURL}/simple/supported_vs_currencies`, {
          headers: CoinGeckoConfig.headers
        }),
      );

      if (!response)
        throw new HttpException(
          'External API did not respond',
          HttpStatus.REQUEST_TIMEOUT,
        );

      return response.data;
    } catch (error) {
      console.error('Error fetching data from NATS:', error.message);
      throw new HttpException('Failed to fetch data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async getCoinPricing(coinId: string, currency: string): Promise<any> {
    try {
      console.log('Calling CoinGecko simple price API');
      const response = await firstValueFrom(
        this.httpService.get(`${CoinGeckoConfig.baseURL}/simple/price`, {
          headers: CoinGeckoConfig.headers,
          params: {
            ...CoinGeckoConfig.simplePriceParams,
            ids: coinId,
            vs_currencies: currency,
          },
        }),
      );

      if (!response)
        throw new HttpException(
          'External API did not respond',
          HttpStatus.REQUEST_TIMEOUT,
        );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from NATS:', error.message);
      throw new HttpException('Failed to fetch data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMarketData(ids: string): Promise<any> {
    try {
      console.log('Calling coin gecko market-data api');
      const response = await firstValueFrom(
        this.httpService.get(`${CoinGeckoConfig.baseURL}/simple/price`, {
          headers: CoinGeckoConfig.headers,
          params: {
            ...CoinGeckoConfig.marketdataParams,
            ids: ids,
          },
        }),
      );

      if (!response)
        throw new HttpException(
          'External API did not respond',
          HttpStatus.REQUEST_TIMEOUT,
        );

      console.log(response.data);
      const marketData = response.data;
      const formattedData = [];

      for (const cryptoName in marketData) {
        formattedData.push({
          crypto_name: cryptoName,
          usd: marketData[cryptoName].usd,
          created_date: new Date(),
          usd_market_cap: marketData[cryptoName].usd_market_cap,
          usd_24h_vol: marketData[cryptoName].usd_24h_vol,
          usd_24h_change: marketData[cryptoName].usd_24h_change,
        });
      }
      console.log(formattedData);
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from('market-data')
        .insert(formattedData)
        .select();

      return response.data;
    } catch (error) {
      console.error('Error fetching data from NATS:', error.message);
      throw new HttpException('Failed to fetch data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
