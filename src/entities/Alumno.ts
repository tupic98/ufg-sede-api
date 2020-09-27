import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToOne,
  JoinColumn

} from 'typeorm';
import { Length } from 'class-validator';
import { Modalidad } from "./Modalidad";
import { Seccion } from './Seccion';
import { Grado } from './Grado';
import { Persona } from './Persona';
import { Calificacion } from './Calificacion';

@Entity()
@Unique(['codigo'])
export class Alumno {
  @PrimaryGeneratedColumn()
  alumno_id: number;

  @Column()
  anno: number;

  @Column()
  nombres: string;

  @Column()
  @Length(0, 20)
  boleta: string;

  @Column()
  aprovado: boolean;

  @Column({ type: "decimal", precision: 4, scale: 2 })
  promedio_final: number;

  @Column({ type: "decimal", precision: 4, scale: 2 })
  promedio_insti: number;

  @Column("text")
  codigo: string;

  @Column()
  firsttime: boolean;

  @ManyToOne(type => Modalidad, modalidad => modalidad.alumnos)
  modalidad: Modalidad;

  @ManyToOne(type => Seccion, seccion => seccion.alumnos)
  seccion: Seccion;

  @ManyToOne(type => Grado, grado => grado.alumnos)
  grado: Grado;

  @ManyToOne(type => Calificacion, calificacion => calificacion.alumnos)
  calificacion: Calificacion[];

  @OneToOne(type => Persona)
  @JoinColumn()
  persona: Persona;
}