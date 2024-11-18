import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    HttpStatus,
    HttpCode,
    NotFoundException,
  } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';

  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(){
      const data = await this.userService.findAll();
      return {
        message: 'Users fetched successfully',
        data,
      };
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: number) {
      const user = await this.userService.findOne(id);
      return {
        message: 'User fetched successfully',
        data: user,
      };
    }
  
    @Post()
    @HttpCode(HttpStatus.CREATED) 
    async create(@Body() createUserDto: CreateUserDto) {
      const createdProduct = await this.userService.create(createUserDto);
      return {
        message: 'User created successfully',
        data: createdProduct,
      };
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK) 
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
      const updateUser = await this.userService.update(id, updateUserDto);
      return {
        message: 'User update successfully',
        data: updateUser,
      };
    }
  
    @Put('inactive/:id')
    @HttpCode(HttpStatus.OK)  
    async inactive(@Param('id') id: number): Promise<any> {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userService.inactive(id);
      return {
        message: 'User Inactive successfully',
      };
    }

    @Put('active/:id')
    @HttpCode(HttpStatus.OK)  
    async active(@Param('id') id: number): Promise<any> {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userService.active(id);
      return {
        message: 'User Active successfully',
      };
    }
  
  }
  