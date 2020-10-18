import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn, PrimaryGeneratedColumn
} from "typeorm";
import { Alumno } from "./Alumno";
import { Materia } from "./Materia";
import { Modulo } from "./Modulo";

@Entity()
export class Calificacion {

    @PrimaryGeneratedColumn()
    calificacion_id: number;

    @Column({ type: "decimal", precision: 4, scale: 2 })
    nota: number;

    @Column({ nullable: true })
    aprobado: boolean;

    @Column({ nullable: true })
    link_rec: string;

    @Column({ nullable: true })
    rec_habilitada: boolean;

    @Column()
    prueba_ext: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    updated_by: string;

    @ManyToOne(type => Alumno, alumno => alumno.calificaciones, { nullable: false })
    alumno: Alumno;

    @ManyToOne(type => Materia, materia => materia.calificaciones, { nullable: false })
    materia: Materia;

    @ManyToOne(type => Modulo, modulo => modulo.calificaciones, { nullable: false })
    modulo: Modulo;
}