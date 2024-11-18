import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Role } from '../role/entity/role.entity';
import { RolesModule } from '../role/role.module';
import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UsersModule {}
