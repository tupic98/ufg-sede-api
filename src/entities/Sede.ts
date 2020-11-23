import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
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

  @Column({ name: 'sede_logo', type: 'text' })
  @IsOptional()
  @IsString()
  logo: string;

  @Column({ name: 'sede_code', type: 'text' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Column({ name: 'sede_address', type: 'text' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @OneToMany(
    (type) => Person,
    (person) => person.sede
  )
  persons: Person[];
}
