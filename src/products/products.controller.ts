import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.ADMIN )
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, token related' })
  @ApiResponse({ status: 403, description: 'Forbidden, token related' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth( ValidRoles.ADMIN )
  update(
    @Param('id', ParseUUIDPipe, ) id: string,
     @Body() updateProductDto: UpdateProductDto,
     @GetUser() user: User
    ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.ADMIN )
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productsService.remove(id);
  }
}
