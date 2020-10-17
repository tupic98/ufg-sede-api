import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Sede } from "./Sede";

@Entity()
export class Persona {
  @PrimaryGeneratedColumn()
  persona_id: number;

  @Column({unique: true})
  @IsNotEmpty()
  usuario: string;

  @Column()
  @Length(0, 20)
  @IsNotEmpty()
  nombres: string;

  @Column()
  @Length(0, 20)
  @IsNotEmpty()
  apellidos: string;

  @Column({ nullable: true })
  @Length(0, 8)
  numero: string;

  @Column({ nullable: true ,unique: true})
  correo: string;

  @Column({ nullable: true })
  @Length(0, 8)
  numero_alt: string;

  @Column({ default: true })
  estado: boolean;

  @ManyToOne(type => Sede, sede => sede.personas, { nullable: false })
  sede: Sede;
}