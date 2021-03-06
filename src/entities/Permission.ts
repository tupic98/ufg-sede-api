import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({ name: 'permission_id', type: 'int' })
  id: number;

  @Column({
    name: 'permission_type', type: 'varchar', length: '50'
  })
  @IsNotEmpty()
  type: string;

  @Column({ name: 'permission_name', type: 'varchar', length: '50' })
  @IsNotEmpty()
  name: string;
}
