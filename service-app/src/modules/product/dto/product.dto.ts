import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDTO {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is missing' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is missing' })
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'name is missing' })
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: 'price is missing' })
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
export class ResponseDto<T> {
  message: string;
  data: T;
  totalCount?: number;
  totalPages?: number;
}
