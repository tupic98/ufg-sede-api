import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({ name: 'permission_id', type: 'int' })
  id: number;

  @Column({ name: 'role_name', type: 'varchar', length: '20' })
  @IsNotEmpty()
  name: string;
}
