import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Permission } from '../permission/entity/permission.entity';
import { PermissionsModule } from '../permission/permission.module';


@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), PermissionsModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RolesModule {}
