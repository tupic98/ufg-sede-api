import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Subject } from './Subject';
import { Module } from './Module';
import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString } from 'class-validator';

@Entity()
export class Qualification {
  @PrimaryGeneratedColumn({ name: 'qualification_id', type: 'int' })
  id: number;

  @Column({
    name: 'qualification_note',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  note: number;

  @Column({ name: 'qualification_approved', type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @Column({ name: 'qualification_recoverLink', type: 'text' })
  @IsOptional()
  @IsString()
  recoverLink: string;

  @Column({ name: 'qualification_recoverEnabled', type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  recoverEnabled: boolean;

  @Column({ name: 'qualification_extTest', type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  isExternalTest: boolean;

  @Column({ name: 'qualification_updatedBy', type: 'text' })
  @IsOptional()
  @IsString()
  updatedBy: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    (type) => Subject,
    (subject) => subject.qualifications
  )
  @JoinColumn({ name: 'subject_id' })
  @IsNotEmptyObject()
  subject: Subject;

  @ManyToOne(
    (type) => Module,
    (module) => module.qualifications
  )
  @JoinColumn({ name: 'module_id' })
  @IsNotEmptyObject()
  module: Module;
}
