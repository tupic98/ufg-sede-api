import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';

@Entity()
export class Section {
  @PrimaryGeneratedColumn({ name: 'section_id', type: 'int' })
  id: number;

  @Column({ name: 'section_name', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  name: string;

  @OneToMany(
    (type) => Student,
    (student) => student.section
  )
  students: Student[];
}
