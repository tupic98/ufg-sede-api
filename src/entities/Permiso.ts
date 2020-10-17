import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn()
    permiso_id: number;

    @Column()
    @Length(0, 20)
    @IsNotEmpty()
    permiso_name: string;

}