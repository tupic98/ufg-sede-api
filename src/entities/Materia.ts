import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany, 
    ManyToOne
} from 'typeorm';
import { Length } from 'class-validator';
import { Usuario } from "./Usuario";
import { Grado } from './Grado';
import { Calificacion } from './Calificacion';

@Entity()
export class Materia {
    @PrimaryGeneratedColumn()
    materia_id: number;

    @Column()
    @Length(0, 20)
    materia_nombre: string;

    @OneToMany(type => Usuario, usuario => usuario.materia)
    usuarios: Usuario[];

    @ManyToOne(type => Grado, grado => grado.materias, { nullable: false })
    grado: Grado;

    @OneToMany(type => Calificacion, calificacion => calificacion.materia)
    calificaciones: Calificacion[];
}