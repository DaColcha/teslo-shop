import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { read } from 'fs';
import Product from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name)

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ) {}

  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll( paginationDto: PaginationDto) {

    const { limit=10, offset=0 } = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset

      // TODO: relations
    });
  }

  async findOne(term: string) {

    let product: Product;
    if( isUUID(term) ){
      product = await this.productRepository.findOneBy( { id: term} );
    }else{
      const queryBuilder =  this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`title = :title or slug= :slug`, { title: term, slug: term })
        .getOne();
    }

    if (!product) throw new NotFoundException("product not found");

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) throw new NotFoundException("product not found");

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {

    const product = await this.findOne(id);

    if(product) await this.productRepository.delete(product.id);

    return { message: "Product deleted" };
  }

  private handleExceptions( error: any){

    if (error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error.message);
    throw new InternalServerErrorException("unexpected error, check server logs");
  }


}