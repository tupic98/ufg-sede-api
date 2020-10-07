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
import { Subject } from './Subject';

@Entity()
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id', type: 'int' })
  id: number;

  @Column({ name: 'student_year', type: 'smallint' })
  year: number;

  @Column({ name: 'student_report', type: 'text' })
  report: string;

  @Column({ name: 'student_approved', type: 'boolean' })
  approved: boolean;

  @Column({
    name: 'student_finalAverage',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  finalAverage: number;

  @Column({
    name: 'student_institutionalAverage',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  institutionalAverage: number;

  @Column({ name: 'student_code', type: 'varchar', length: '15' })
  code: string;

  @Column({ name: 'student_firstTiem', type: 'boolean', default: 'true' })
  firstTime: boolean;

  @OneToOne((type) => Person, { cascade: ['insert'] })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(
    (type) => Modality,
    (modality) => modality.students,
  )
  @JoinColumn({ name: 'modality_id' })
  modality: Modality;

  @ManyToOne(
    (type) => Section,
    (section) => section.students
  )
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(
    (type) => Grade,
    (grade) => grade.students
  )
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToMany(
    (type) => Subject,
    (subject) => subject.student
  )
  subjects: Subject[];
}
