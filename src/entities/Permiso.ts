import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    ManyToMany
} from 'typeorm';
import { Length } from 'class-validator';
import { Rol } from './Rol';

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn()
    permiso_id: number;

    @Column()
    @Length(0, 20)
    permiso_name: string;

    @ManyToMany(type => Rol, rol =>rol.permisos)
    @JoinTable()
    rols: Rol[];
}