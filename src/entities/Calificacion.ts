import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn, 
    UpdateDateColumn
} from "typeorm";
import { Alumno } from "./Alumno";
import { Materia } from "./Materia";
import { Modulo } from "./Modulo";

@Entity()
export class Calificacion {
    @Column({ type: "decimal", precision: 4, scale: 2 })
    nota: number;

    @Column()
    aprobado: boolean;

    @Column()
    link_rec: string;

    @Column()
    rec_habilitada: boolean;

    @Column()
    prueba_ext: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    updated_by: string;

    @ManyToOne(type => Alumno, alumno => alumno.calificaciones)
    alumnos: Alumno;

    @ManyToOne(type => Materia, materia => materia.calificaciones)
    materia: Materia;

    @ManyToOne(type => Modulo, modulo => modulo.calificaciones)
    modulo: Modulo;
}