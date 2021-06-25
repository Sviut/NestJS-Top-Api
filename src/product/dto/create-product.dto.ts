import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class ProductCharacteristicDto {
  @IsString()
  name: string

  @IsString()
  value: string
}

export class CreateProductDto {
  @IsString()
  image: string

  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString()
  title: string

  @Min(1, { message: 'Значение не может быть меньше 1' })
  @IsNumber()
  price: number

  @IsOptional()
  @IsNumber()
  oldPrice?: number

  @IsNumber()
  credit: number

  @IsString()
  description: string

  @IsString()
  advantages: string

  @IsString()
  disAdvantages: string

  @IsArray()
  @IsString({ each: true })
  categories: string[]

  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[]
}
