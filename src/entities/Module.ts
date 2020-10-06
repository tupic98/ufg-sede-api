import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Qualification } from './Qualification';

@Entity()
export class Module {
  @PrimaryGeneratedColumn({ name: 'module_id', type: 'smallint' })
  id: number;

  @Column({
    name: 'module_number',
    type: 'numeric',
    precision: 4,
  })
  moduleNumber: number;

  @OneToMany(
    (type) => Qualification,
    (qualification) => qualification.module
  )
  qualifications: Qualification[];
}
