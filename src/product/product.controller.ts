import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FindProductDto } from './dto/find-product.dto'
import { ProductModel } from './product.model'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductService } from './product.service'
import { PRODUCT_NOT_FOUND } from './product.constants'
import { IdValidationPipe } from '../pipes/api-validation.pipes'
import { JwtAuthGuards } from '../auth/guards/jwt.guards'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuards)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @UseGuards(JwtAuthGuards)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id)
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND)
    }
    return product
  }

  @UseGuards(JwtAuthGuards)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id)
    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND)
    }
  }

  @UseGuards(JwtAuthGuards)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const updatedProduct = await this.productService.updateById(id, dto)
    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND)
    }
    return updatedProduct
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto)
  }
}
