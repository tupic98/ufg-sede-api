import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Sede {
  @PrimaryGeneratedColumn({ name: 'sede_id', type: 'int' })
  id: number;

  @Column({ name: 'sede_name', type: 'text' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ name: 'sede_logo', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  logo: string;

  @Column({ name: 'sede_code', type: 'text' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Column({ name: 'sede_address', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  address: string;

  @Column({ name: 'sede_active', type: 'boolean', default: false })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @OneToMany(
    (type) => Person,
    (person) => person.sede
  )
  persons: Person[];
}
