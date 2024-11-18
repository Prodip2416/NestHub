import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entity/permission.entity';
import { CreatePermissionDTO } from './dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: number): Promise<Permission> {
    const product = await this.permissionRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return product;
  }

  async create(createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
    const product = this.permissionRepository.create(createPermissionDTO);
    return this.permissionRepository.save(product);
  }

  async update(
    id: number,
    createPermissionDTO: CreatePermissionDTO,
  ): Promise<Permission> {
    await this.findOne(id); // Ensure product exists
    await this.permissionRepository.update(id, createPermissionDTO);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }
}
