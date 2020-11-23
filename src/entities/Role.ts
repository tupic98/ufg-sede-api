import { IsNotEmpty, IsString, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id', type: 'int' })
  id: number;

  @Column({ name: 'role_name', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  name: string;

  @Column({ name: 'role_type', type: 'varchar', length: '8' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 8)
  type: string;

  @ManyToMany((type) => Permission)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(
    (type) => User,
    (user) => user.role
  )
  users: User[];
}
