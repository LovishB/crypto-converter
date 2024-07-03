import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CoinGeckoConfig } from "src/config/coingecko-config";
import { SupabaseClientService } from "src/supabase/supabase-client/supabase-client.service";

@Injectable()
export class MarketDataService {
  /**
   * Fetch current pricing of a cryptocurrency against a specified currency from CoinGecko API.
   * @param coinId The ID of the cryptocurrency.
   * @param currency The currency code (e.g., 'usd') to convert the cryptocurrency price to.
   * @returns The current pricing data fetched from CoinGecko.
   * @throws HttpException if fetching data fails.
   */

  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseClientService,
  ) {}

  // Fetch current pricing of a cryptocurrency against a specified currency from CoinGecko API
  async getCoinPricing(coinId: string, currency: string): Promise<any> {
    console.log("Calling CoinGecko simple price API");

    try {
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

      return response.data;
    } catch (error) {
      console.error("Error fetching data from NATS:", error.message);
      throw new HttpException(
        "Failed to fetch data",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Fetch market data for multiple cryptocurrencies from CoinGecko API and store in Supabase
  async getMarketData(ids: string, insertIntoDB: boolean): Promise<any> {
    console.log("Calling CoinGecko market-data API");
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${CoinGeckoConfig.baseURL}/simple/price`, {
          headers: CoinGeckoConfig.headers,
          params: {
            ...CoinGeckoConfig.marketdataParams,
            ids: ids,
          },
        }),
      );

      // Checking if we need to inset market data in database
      if (insertIntoDB) {
        this.insertTableMarketData(response.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching data from NATS:", error.message);
      throw new HttpException(
        "Failed to fetch data",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // function to format the response from external API and insert into database
  private insertTableMarketData(marketData) {
    console.log(marketData);
    const formattedData = [];
    // Formatting reponse to insert in database
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
    // Calling Supabase database to insert market data
    this.supabaseService.insertTableMarketData(formattedData);
  }
}
