import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn, 
    OneToOne

} from 'typeorm';
import { Length } from 'class-validator';
import { Materia } from './Materia';
import { Persona } from './Persona';
import { Rol } from './Rol';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    usuario_id: number;

    @Column()
    @Length(4, 100)
    password: string;

    @ManyToOne(type => Rol, rol => rol.usuarios, { nullable: false })
    rol: Rol;

    @ManyToOne(type => Materia, materia => materia.usuarios, { nullable: false })
    materia: Materia;

    @OneToOne(type => Persona,{ nullable: false})
    @JoinColumn()
    persona: Persona;
}