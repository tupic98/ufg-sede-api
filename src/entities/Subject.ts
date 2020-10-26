import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn, ManyToMany,
} from 'typeorm';
import { Grade } from './Grade';
import { Qualification } from './Qualification';
import { User } from './User';
import { Student } from "./Student";

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

  @ManyToMany(() => Student, student => student.subjects)
  students: Student[];
}
