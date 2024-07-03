import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  Render,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("market-data")
export class MarketController {
  constructor(@Inject("NATS_SERVICE") private natsClient: ClientProxy) {}

  // Handler for GET request to "/market-data/converter"
  @Get("converter")
  @Render("getTop10Coins")
  async getTop10Coins() {
    console.log(`Getting Top10 Coins and supported fiat`);

    // Sending request to the crypto-market microservice to get top 10 coins and supported fiats
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: "getTop10Coins" }, {}),
    );
    if (!response) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    // Pass fetched data to the view template
    return this.extractTopCryptoAndFiats(response);
  }

  // Handler for GET request to "/market-data/historyData"
  @Get("historyData")
  @Render("historyData")
  async getHistoryOfCoin(@Query("selectedCrypto") selectedCrypto: string) {
    console.log(`Getting history data of ${selectedCrypto}`);

    //Sending request to crypto-market microservice to get Historical Data of selected coin
    const historicalData = await this.getHistoryData(selectedCrypto);

    // Pass fetched data to the view template
    return { marketData: historicalData, selectedCrypto };
  }

  // Handler for GET request to "/market-data/get24Chart"
  @Get("get24Chart")
  @Render("get24Chart")
  async get24Chart(@Query("selectedCrypto") selectedCrypto: string) {
    console.log(`Getting 24hr change data of ${selectedCrypto}`);

    //Sending request to crypto-market microservice to get Historical Data of selected coin
    const historicalData = await this.getHistoryData(selectedCrypto);

    // Pass fetched data to the view template
    return this.stringfyHistoricalData(historicalData);
  }

  // Handler for GET request to "/market-data/getRealTimeData"
  @Get("getRealTimeData")
  @Render("getRealTimeData")
  async getRealTimeData(@Query("selectedCrypto") selectedCrypto: string) {
    console.log(`Getting rela-time market data of ${selectedCrypto}`);

    //Sending request to crypto-market microservice to get Real-time market Data of selected coin
    const realTimeData = await lastValueFrom(
      this.natsClient.send({ cmd: "getRealTimeData" }, { ids: selectedCrypto }),
    );
    if (!realTimeData)
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    // Pass fetched data to the view template
    return { crypto: realTimeData };
  }

  //Helper function to send request to market-data microservice to get History of coin
  private async getHistoryData(selectedCrypto: string) {
    const historicalData = await lastValueFrom(
      this.natsClient.send(
        { cmd: "getHistoryOfCoin" },
        { coin: selectedCrypto },
      ),
    );
    if (!historicalData)
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    return historicalData;
  }

  // Helper function to extract crypto and fiat values from the response
  private extractTopCryptoAndFiats(response) {
    const cryptoResponse = response.find(
      (item) => item.currency_type === "crypto",
    );
    const fiatResponse = response.find((item) => item.currency_type === "fiat");
    const topCrypto = cryptoResponse ? cryptoResponse.value.split(",") : [];
    const fiats = fiatResponse ? fiatResponse.value.split(",") : [];
    return { topCrypto, fiats };
  }

  // Helper function to stringfy historical data
  private stringfyHistoricalData(historicalData) {
    const labels = JSON.stringify(
      historicalData.map((data) => data.created_date),
    );
    const usdChange = JSON.stringify(
      historicalData.map((data) => data.usd_24h_change),
    );
    return { historicalData, labels, usdChange };
  }
}
