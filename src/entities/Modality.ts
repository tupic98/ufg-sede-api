import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';

@Entity()
export class Modality {
  @PrimaryGeneratedColumn({ name: 'modality_id', type: 'int' })
  id: number;

  @Column({ name: 'modality_type', type: 'varchar', length: '20' })
  type: string;

  @OneToMany(
    (type) => Student,
    (student) => student.modality
  )
  students: Student[];
}
