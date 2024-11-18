import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { RoleDTO } from './dto/role.dto';
import { Permission } from '../permission/entity/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
        relations: ['permissions'], 
      });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],  // Eagerly load the permissions
      });
      
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
    return role;
  }

  async create(roleDTO: RoleDTO): Promise<Role> {
    // Fetch permissions by IDs
    const permissions = await this.permissionRepository.findByIds(roleDTO.permissions);

    const role = this.roleRepository.create({
        name: roleDTO.name,
        permissions, 
    });

    return this.roleRepository.save(role);
  }

  async update(id: number, roleDTO: RoleDTO): Promise<Role> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
  
    const permissions = await this.permissionRepository.findByIds(roleDTO.permissions);
    role.name = roleDTO.name;
    role.permissions = permissions;
  
    return await this.roleRepository.save(role);
  }
  

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.roleRepository.remove(permission);
  }

}
