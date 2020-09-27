import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Alumno } from "./Alumno";
import { Materia } from './Materia';

@Entity()
export class Grado {
    @PrimaryGeneratedColumn()
    grado_id: number;

    @Column({ length: 10 })
    @IsNotEmpty()
    grado: string;

    @Column({ type: "decimal", precision: 3, scale: 2 })
    perc_inst: number;

    @Column({ type: "decimal", precision: 3, scale: 2 })
    perc_ext: number;

    @OneToMany(type => Alumno, alumno => alumno.grado)
    alumnos: Alumno[];

    @OneToMany(type => Materia, materia => materia.grado)
    materias: Materia[];
}