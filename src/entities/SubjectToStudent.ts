import { Student } from './Student';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Subject } from './Subject';
import { IsNotEmptyObject } from 'class-validator';

@Entity()
export class SubjectToStudent {
    @PrimaryColumn({ name: 'student_code', type: 'varchar', length: '15' })
    student_code: string

    @ManyToOne(
        (type) => Student,
        (student) => student.subjectQualifications
    )
    @JoinColumn({ name: 'student_id' })
    @IsNotEmptyObject()
    student: Student;
    
    @ManyToOne(
        (type) => Subject,
        (subject) => subject.studentQualifications
    )
    @JoinColumn({ name: 'subject_id ' })
    @IsNotEmptyObject()
    subject: Subject;
}