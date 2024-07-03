export class ConvertFiatDto {
  //not adding class validator as payload is validated from api-gateway side
  crypto: string;
  total: number;
  fiat: string;
}
