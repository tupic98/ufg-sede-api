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
  note: number;

  @Column({ name: 'qualification_approved', type: 'boolean' })
  approved: boolean;

  @Column({ name: 'qualification_recoverLink', type: 'text' })
  recoverLink: string;

  @Column({ name: 'qualification_recoverEnabled', type: 'boolean' })
  recoverEnabled: boolean;

  @Column({ name: 'qualification_extTest', type: 'boolean' })
  isExternalTest: boolean;

  @Column({ name: 'qualification_updatedBy', type: 'text' })
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
  subject: Subject;

  @ManyToOne(
    (type) => Module,
    (module) => module.qualifications
  )
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
