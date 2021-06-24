import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @IsString()
  name: string

  @IsString()
  title: string

  @IsString()
  description: string

  @Max(5, { message: 'Значение не может быть больше 5' })
  @Min(1, { message: 'Значение не может быть меньше 1' })
  @IsNumber()
  rating: number

  @IsString()
  productId: string
}
