import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Grade } from './Grade';
import { Qualification } from './Qualification';
import { Student } from './Student';
import { User } from './User';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn({ name: 'subject_id', type: 'int' })
  id: number;

  @Column({ name: 'subject_name', type: 'varchar', length: '30' })
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
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @ManyToOne(
    (type) => Student,
    (student) => student.subjects
  )
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
