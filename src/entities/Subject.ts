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
import { User } from './User';
import { IsNotEmpty, IsString, IsNotEmptyObject, IsOptional, IsBoolean } from 'class-validator';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn({ name: 'subject_id', type: 'int' })
  id: number;

  @Column({ name: 'subject_name', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ name: 'subject_is_external', type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  isExternalTest: boolean;

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
