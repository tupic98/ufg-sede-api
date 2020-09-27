import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    ManyToOne,
    JoinColumn, 
    OneToOne

} from 'typeorm';
import { Length } from 'class-validator';
import { Materia } from './Materia';
import { Persona } from './Persona';
import { Rol } from './Rol';

@Entity()
@Unique(['codigo'])
export class Usuario {
    @PrimaryGeneratedColumn()
    usuario_id: number;

    @Column()
    @Length(0, 20)
    boleta: string;

    @ManyToOne(type => Rol, rol => rol.usuarios)
    rol: Rol;

    @ManyToOne(type => Materia, materia => materia.usuarios)
    materia: Materia;

    @OneToOne(type => Persona)
    @JoinColumn()
    persona: Persona;
}