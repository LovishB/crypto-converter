export class ConvertFiatDto {
  //Not adding class-validator as values are validated on api-gateway
  crypto: string;
  total: number;
  fiat: string;
}
