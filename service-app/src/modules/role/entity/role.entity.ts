import { Permission } from 'src/modules/permission/entity/permission.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., Admin, Customer, Seller

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
