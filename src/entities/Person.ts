import {
  Column,
  Entity,
  ManyToOne,
  Unique,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsNotEmptyObject, IsOptional, Length, MaxLength } from 'class-validator';
import { Sede } from './Sede';

@Entity()
@Unique(['username'])
export class Person {
  @PrimaryGeneratedColumn({ name: 'person_id', type: 'bigint' })
  id: number;

  @Column({ name: 'person_username', type: 'varchar', length: '30' })
  @Length(3, 30)
  username: string;

  @Column({ name: 'person_firstName', type: 'varchar', length: '40' })
  @Length(3, 40)
  firstName: string;

  @Column({ name: 'person_lastName', type: 'varchar', length: '40' })
  @Length(3, 40)
  lastName: string;

  @Column({ name: 'person_phoneNumber', type: 'varchar', length: '8', nullable: true })
  @IsOptional()
  @Length(8, 8)
  phoneNumber: string | null;

  @Column({ name: 'person_email', type: 'varchar', length: '60', nullable: true })
  @IsOptional()
  @MaxLength(60)
  @IsEmail()
  email: string | null;

  @Column({ name: 'person_altPhoneNumber', type: 'varchar', length: '8', nullable: true })
  @IsOptional()
  @Length(8, 8)
  altPhoneNumber: string | null;

  @Column({ name: 'person_status', type: 'boolean', default: 'true' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ManyToOne((type) => Sede, (sede) => sede.persons)
  @JoinColumn({ name: 'sede_id' })
  @IsNotEmptyObject()
  sede: Sede;
}
