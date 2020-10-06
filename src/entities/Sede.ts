import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Sede {
  @PrimaryGeneratedColumn({ name: 'sede_id', type: 'int' })
  id: number;

  @Column({ name: 'sede_name', type: 'text' })
  name: string;

  @Column({ name: 'sede_logo', type: 'text' })
  logo: string;

  @Column({ name: 'sede_address', type: 'text' })
  address: string;

  @OneToMany(
    (type) => Person,
    (person) => person.sede
  )
  persons: Person[];
}
