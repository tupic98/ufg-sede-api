import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Alumno } from "./Alumno";

@Entity()
export class Seccion {
    @PrimaryGeneratedColumn()
    seccion_id: number;

    @Column()
    @IsNotEmpty()
    nombre_seccion: string;

    @OneToMany(type => Alumno, alumno => alumno.seccion)
    alumnos: Alumno[];
}