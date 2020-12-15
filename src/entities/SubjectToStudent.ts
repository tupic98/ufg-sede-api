import { Column } from 'typeorm';
// import { Qualification } from './Qualification';
import { Student } from './Student';
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from './Subject';
import { IsNotEmptyObject } from 'class-validator';
import { Qualification } from './Qualification';

@Entity()
export class SubjectToStudent {
    @PrimaryGeneratedColumn({ name: 'subject_student_id', type: 'int' })
    id: number;

    @Column({ name: 'student_code', type: 'varchar', length: '15' })
    student_code: string

    @ManyToOne(
        (type) => Student,
        (student) => student.subjectQualifications
        , { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'student_id'})
    @IsNotEmptyObject()
    student: Student;

    @ManyToOne(
        (type) => Subject,
        (subject) => subject.studentQualifications
    )
    @JoinColumn({ name: 'subject_id' })
    @IsNotEmptyObject()
    subject: Subject;

    @OneToMany(
      (type) => Qualification,
      (qualification) => qualification.subjectStudent
    )
    qualifications: Qualification[]
}
