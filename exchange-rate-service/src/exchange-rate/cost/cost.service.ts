import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConvertFiatDto } from '../dtos/ConvertFiatDto';

@Injectable()
export class CostService {
  calculateCost(
    convertFiatDto: ConvertFiatDto,
    convertedPrice: any,
  ): number {
    try {
      const crypto = Object.keys(convertedPrice)[0];
      const pricing = convertedPrice[crypto]?.[convertFiatDto.fiat] || 1;
      const cost = pricing * convertFiatDto.total;
      console.log(
        `pricing: ${pricing} x totalCoin: ${convertFiatDto.total} = ${cost}`,
      );
      return cost ;
    } catch (error) {
      throw new HttpException(
        'Failed to calculate cost',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
