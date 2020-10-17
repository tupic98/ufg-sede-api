import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany, 
    ManyToMany, 
    JoinTable
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Usuario } from "./Usuario";
import { Permiso } from './Permiso';

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    rol_id: number;

    @Column()
    @Length(0, 20)
    @IsNotEmpty()
    rol_nombre: string;

    @Column({ type: "text" })
    tipo: string;

    @OneToMany(type => Usuario, usuario => usuario.rol)
    usuarios: Usuario[];

    @ManyToMany(type => Permiso)
    @JoinTable()
    permisos: Permiso[];
}