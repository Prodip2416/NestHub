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
import { RoleService } from './role.service';
import { RoleDTO } from './dto/role.dto';

  
  @Controller('roles')
  export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(){
        const data = await this.roleService.findAll();
        return {
        message: 'Roles fetched successfully',
        data,
        };
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: number) {
      const permission = await this.roleService.findOne(id);
      return {
        message: 'Role fetched successfully',
        data: permission,
      };
    }
  
    @Post()
    @HttpCode(HttpStatus.CREATED) 
    async create(@Body() roleDTO: RoleDTO) {
      const createdProduct = await this.roleService.create(roleDTO);
      return {
        message: 'Role created successfully',
        data: createdProduct,
      };
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK) 
    async update(@Param('id') id: number, @Body() roleDTO: RoleDTO) {
      const updateProduct = await this.roleService.update(id, roleDTO);
      return {
        message: 'Role update successfully',
        data: updateProduct,
      };
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)  
    async delete(@Param('id') id: number): Promise<any> {
      const product = await this.roleService.findOne(id);
      if (!product) {
        throw new NotFoundException('Role not found');
      }
      await this.roleService.remove(id);
      return {
        message: 'Role deleted successfully',
      };
    }
  
  }
  