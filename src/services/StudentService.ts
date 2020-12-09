import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Student} from "../entities/Student";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) { }

  public async findByCode(code: string): Promise<Student | undefined> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.code = :code', { code })
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .getOne();
  }

  public async findByCodeWithRelation(code: string): Promise<Student | undefined> {
    return await this.studentRepository
      .createQueryBuilder('student')
      // .leftJoin('student.subjectQualifications', 'subjectQualifications')
      // .leftJoin('subjectQualifications.qualifications', 'qualifications')
      // .leftJoinAndMapOne('student.modules', 'qualifications.module', 'modules')
      .where('student.code = :code', { code })
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .leftJoinAndSelect('student.modality', 'modality')
      .leftJoinAndSelect('student.section', 'section')
      .leftJoinAndSelect('student.grade', 'grade')
      .leftJoinAndSelect('student.subjectQualifications', 'subjectQualifications')
      .leftJoinAndSelect('subjectQualifications.subject', 'subject')
      .leftJoinAndSelect('subjectQualifications.qualifications', 'qualifications')
      .leftJoinAndSelect('qualifications.module', 'module')
      .getOne();
  }

  public async findById(id: number): Promise<Student | undefined> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :id', { id })
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .getOne();
  }

  public async findByIdWithRelation(id: number): Promise<Student | undefined> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .leftJoinAndSelect('student.modality', 'modality')
      .leftJoinAndSelect('student.section', 'section')
      .leftJoinAndSelect('student.grade', 'grade')
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.modality', 'modality')
      .leftJoinAndSelect('student.section', 'section')
      .leftJoinAndSelect('student.grade', 'grade')
      .paginate(10);
  }

  public async create(student: Student): Promise<Student> {
    return await this.studentRepository.save(student);
  }

  public async update(newStudent: Student): Promise<UpdateResult> {
    return await this.studentRepository.update(newStudent.id, newStudent);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.studentRepository.delete(id);
  }
}
