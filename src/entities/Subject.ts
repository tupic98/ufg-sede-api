import { SubjectToStudent } from './SubjectToStudent';
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
import { User } from './User';
import { IsNotEmpty, IsString, IsNotEmptyObject } from 'class-validator';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn({ name: 'subject_id', type: 'int' })
  id: number;

  @Column({ name: 'subject_name', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
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
  @IsNotEmptyObject()
  grade: Grade;

  @OneToMany(
    (type) => SubjectToStudent,
    (subjectxstudent) => subjectxstudent.subject
  )
  studentQualifications: SubjectToStudent[];
}
