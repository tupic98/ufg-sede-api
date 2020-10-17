import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany

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

  @Column({ nullable: true })
  @Length(0, 20)
  boleta: string;

  @Column({ nullable: true })
  aprovado: boolean;

  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  promedio_final: number;

  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  promedio_insti: number;

  @Column("text")
  codigo: string;

  @Column()
  firsttime: boolean;

  @ManyToOne(type => Modalidad, modalidad => modalidad.alumnos, { nullable: false })
  modalidad: Modalidad;

  @ManyToOne(type => Seccion, seccion => seccion.alumnos, { nullable: false })
  seccion: Seccion;

  @ManyToOne(type => Grado, grado => grado.alumnos, { nullable: false })
  grado: Grado;

  @OneToMany(type => Calificacion, calificacion => calificacion.alumno)
  calificaciones: Calificacion[];

  @OneToOne(type => Persona, { nullable: false })
  @JoinColumn()
  persona: Persona;
}