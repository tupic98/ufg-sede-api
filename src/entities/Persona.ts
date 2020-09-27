import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Sede } from "./Sede";

@Entity()
@Unique(['correo'])
export class Persona {
  @PrimaryGeneratedColumn()
  persona_id: number;

  @Column()
  usuario: string;

  @Column()
  @Length(0, 20)
  nombres: string;

  @Column()
  @Length(0, 20)
  apellidos: string;

  @Column()
  @Length(0, 8)
  numero: string;

  @Column()
  correo: string;

  @Column()
  @Length(0, 8)
  numero_alt: string;

  @Column()
  @IsNotEmpty()
  estado: boolean;

  @OneToMany(type => Sede, sede => sede.persona)
  sedes: Sede[];
}