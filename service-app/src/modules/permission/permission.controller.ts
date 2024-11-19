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
    UseGuards,
  } from '@nestjs/common';
import { PermissionsService } from './permission.service';
import { CreatePermissionDTO } from './dto/permission.dto';
import { JwtAuthGuard } from '../auth/strategies/AuthGuard';
  
  @Controller('permissions')
  @UseGuards(JwtAuthGuard)
  export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(){
        const data = await this.permissionsService.findAll();
        return {
        message: 'Permissions fetched successfully',
        data,
        };
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: number) {
      const permission = await this.permissionsService.findOne(id);
      return {
        message: 'Permission fetched successfully',
        data: permission,
      };
    }
  
    @Post()
    @HttpCode(HttpStatus.CREATED) 
    async create(@Body() createPermissionDTO: CreatePermissionDTO) {
      const createdProduct = await this.permissionsService.create(createPermissionDTO);
      return {
        message: 'Permission created successfully',
        data: createdProduct,
      };
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK) 
    async update(@Param('id') id: number, @Body() createPermissionDTO: CreatePermissionDTO) {
      const updateProduct = await this.permissionsService.update(id, createPermissionDTO);
      return {
        message: 'Permission update successfully',
        data: updateProduct,
      };
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)  
    async delete(@Param('id') id: number): Promise<any> {
      const product = await this.permissionsService.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.permissionsService.remove(id);
      return {
        message: 'Permission deleted successfully',
      };
    }
  
  }
  