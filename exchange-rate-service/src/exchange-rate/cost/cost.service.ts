import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConvertFiatDto } from "../dtos/ConvertFiatDto";

@Injectable()
export class CostService {
  /**
   * Service responsible for calculating the cost of cryptocurrency conversion.
   * @param convertFiatDto - DTO containing conversion details (fiat currency and total coins).
   * @param convertedPrice - Object containing converted cryptocurrency prices.
   * @returns Calculated cost based on the conversion details.
   * @throws HttpException if calculation fails.
   */
  calculateCost(convertFiatDto: ConvertFiatDto, convertedPrice: any): number {
    try {
      const crypto = Object.keys(convertedPrice)[0];
      const pricing = convertedPrice[crypto]?.[convertFiatDto.fiat] || 1;
      const cost = pricing * convertFiatDto.total;

      // Logging calculation details
      console.log(
        `pricing: ${pricing} x totalCoin: ${convertFiatDto.total} = ${cost}`,
      );
      return cost;
    } catch (error) {
      throw new HttpException(
        "Failed to calculate cost",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
