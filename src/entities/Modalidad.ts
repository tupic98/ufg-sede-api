import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Alumno } from "./Alumno";

@Entity()
export class Modalidad {
  @PrimaryGeneratedColumn()
  modalidad_id: number;

  @Column()
  @IsNotEmpty()
  tipo_modalidad: string;

  @OneToMany(type => Alumno, alumno => alumno.modalidad)
  alumnos: Alumno[];
}