import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "VIEW_PRODUCTS", "CREATE_ORDER", "EDIT_USER"
}
