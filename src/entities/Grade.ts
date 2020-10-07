import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { Subject } from './Subject';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn({ name: 'grade_id', type: 'int' })
  id: number;

  @Column({ name: 'grade_grade', type: 'varchar', length: '10' })
  grade: string;

  @Column({
    name: 'grade_instPercentage',
    type: 'numeric',
    precision: 3,
    scale: 2,
  })
  institutionalPercentage: number;

  @Column({
    name: 'grade_extPercentage',
    type: 'numeric',
    precision: 3,
    scale: 2,
  })
  externalPercentage: number;

  @OneToMany(
    (type) => Subject,
    (subject) => subject.grade
  )
  subjects: Subject[];

  @OneToMany(
    (type) => Student,
    (student) => student.grade
  )
  students: Student[];
}
