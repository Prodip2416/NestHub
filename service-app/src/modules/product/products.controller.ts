import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO, ResponseDto, UpdateProductDTO } from './dto/product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseDto<Product[]>> { 
    const products = await this.productsService.findAll();
    return {
      message: 'Products fetched successfully',
      data: products,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<ResponseDto<Product>> {
    const product = await this.productsService.findOne(id);
    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  async create(@Body() createProductDto: CreateProductDTO) {
    const createdProduct = await this.productsService.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: createdProduct,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) 
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDTO) {
    const updateProduct = await this.productsService.update(id, updateProductDto);
    return {
      message: 'Product update successfully',
      data: updateProduct,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)  
  async delete(@Param('id') id: number): Promise<any> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsService.remove(id);
    return {
      message: 'Product deleted successfully',
    };
  }

}
