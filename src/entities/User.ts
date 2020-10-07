import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Subject } from './Subject';
import { Role } from './Role';
import { Person } from './Person';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
  id: number;

  @Column({ name: 'user_password', type: 'varchar', length: '30' })
  @Length(4, 30)
  password: string;

  @OneToOne((type) => Person, { cascade: ['insert'] })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(
    (type) => Role,
    (role) => role.users
  )
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(
    (type) => Subject,
    (subject) => subject.users
  )
  @JoinColumn({ name: 'subject_id'} )
  subject: Subject;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
