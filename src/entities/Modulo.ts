import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
  } from 'typeorm';
import { Calificacion } from './Calificacion';
  
  @Entity()
  export class Modulo {
    @PrimaryGeneratedColumn()
    modulo_id: number;
  
    @Column({ type: "decimal", precision: 1, scale: 0 })
    numero_mod: number;
  
    @OneToMany(() => Calificacion, calificacion => calificacion.modulo)
    calificaciones: Calificacion[];
  }