import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ConvertFiatDto {
  @IsNotEmpty()
  @IsString()
  crypto: string;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsString()
  fiat: string;
}
