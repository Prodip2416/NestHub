import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO, UpdateProductDTO } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { ProductQueryDto } from './dto/productQuery.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(query: ProductQueryDto): Promise<{ data: Product[]; total: number }> {
    const { limit, page, search, sortField, sortOrder } = query;
    const skip = (page - 1) * limit;

    const qb = this.productsRepository.createQueryBuilder('product');

    // Apply search filter
    if (search) {
      qb.where(
        'LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    // Apply sorting and order by
    if (sortOrder) {
      qb.orderBy(`product.id`, sortOrder || 'DESC');
    }
   
    if(page && limit){
      // Apply pagination
      qb.skip(skip).take(limit);
    }
    
    // Execute query and count total
    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    await this.findOne(id); // Ensure product exists
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
