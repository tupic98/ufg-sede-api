import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Qualification } from './Qualification';

@Entity()
export class Module {
  @PrimaryGeneratedColumn({ name: 'module_id', type: 'smallint' })
  id: number;

  @OneToMany(
    (type) => Qualification,
    (qualification) => qualification.module
  )
  qualifications: Qualification[];
}
