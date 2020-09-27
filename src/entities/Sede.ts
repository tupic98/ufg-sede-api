import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { Persona } from "./Persona";

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  sede_id: number;

  @Column()
  sede_nombre: string;

  @Column()
  logo: string;

  @Column()
  dir: string;

  @ManyToOne(type => Persona, persona => persona.sedes)
  persona: Persona;
}