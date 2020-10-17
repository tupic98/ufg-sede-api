import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import { Persona } from "./Persona";

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  sede_id: number;

  @Column()
  @IsNotEmpty()
  sede_nombre: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  dir: string;

  @OneToMany(type => Persona, persona => persona.sede)
  personas: Persona[];
}