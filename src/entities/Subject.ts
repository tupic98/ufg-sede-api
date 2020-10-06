import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from './Grade';
import { Qualification } from './Qualification';
import { Student } from './Student';
import { User } from './User';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn({ name: 'subject_id', type: 'int' })
  id: number;

  @Column({ name: 'subject_id', type: 'varchar', length: '30' })
  name: string;

  @OneToMany(
    (type) => Qualification,
    (qualification) => qualification.subject
  )
  qualifications: Qualification[];

  @OneToMany(
    (type) => User,
    (user) => user.subject
  )
  users: User[];

  @ManyToOne(
    (type) => Grade,
    (grade) => grade.subjects
  )
  grade: Grade;

  @ManyToOne(
    (type) => Student,
    (student) => student.subjects
  )
  student: Student;
}
