import { Role } from 'src/modules/role/entity/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean; 

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string; 

  @Column({ type: 'datetime', nullable: true })
  tokenExpirationDate: Date; 

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date; 

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'boolean', default: false })
  isAccountLocked: boolean; 

  @Column({ type: 'boolean', default: false })
  isPasswordResetRequested: boolean; 

  @Column({ type: 'datetime' })
  createdAt: Date;
  
  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;  

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

}
