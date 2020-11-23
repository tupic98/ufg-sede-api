import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from './Grade';
import { Modality } from './Modality';
import { Person } from './Person';
import { Section } from './Section';
import { SubjectToStudent } from './SubjectToStudent';

@Entity()
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id', type: 'int' })
  id: number;

  @Column({ name: 'student_year', type: 'smallint' })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @Column({ name: 'student_report', type: 'text' })
  @IsOptional()
  @IsString()
  report: string;

  @Column({ name: 'student_approved', type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @Column({
    name: 'student_finalAverage',
    type: 'numeric',
    precision: 4,
    scale: 2,
    nullable: true
  })
  @IsOptional()
  @IsNumber()
  finalAverage: number;

  @Column({
    name: 'student_institutionalAverage',
    type: 'numeric',
    precision: 4,
    scale: 2,
    nullable: true
  })
  @IsOptional()
  @IsNumber()
  institutionalAverage: number;

  @Column({ name: 'student_code', type: 'varchar', length: '15' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Column({ name: 'student_firstTiem', type: 'boolean', default: 'true' })
  @IsNotEmpty()
  @IsBoolean()
  firstTime: boolean;

  @OneToOne((type) => Person, { cascade: ['insert'] })
  @JoinColumn({ name: 'person_id' })
  @IsNotEmptyObject()
  person: Person;

  @ManyToOne(
    (type) => Modality,
    (modality) => modality.students,
  )
  @JoinColumn({ name: 'modality_id' })
  @IsNotEmptyObject()
  modality: Modality;

  @ManyToOne(
    (type) => Section,
    (section) => section.students
  )
  @JoinColumn({ name: 'section_id' })
  @IsNotEmptyObject()
  section: Section;

  @ManyToOne(
    (type) => Grade,
    (grade) => grade.students
  )
  @JoinColumn({ name: 'grade_id' })
  @IsNotEmptyObject()
  grade: Grade;

  @OneToMany(
    (type) => SubjectToStudent,
    (subjectxstudent) => subjectxstudent.student
  )
  subjectQualifications: SubjectToStudent[];
}
