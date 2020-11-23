import {DeleteResult, Repository} from "typeorm";
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
      .getOne();
  }

  public async findById(id: number): Promise<Student | undefined> {
    return await this.studentRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.studentRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.person', 'person')
      .innerJoinAndSelect('student.modality', 'modality')
      .innerJoinAndSelect('student.section', 'section')
      .innerJoinAndSelect('student.grade', 'grade')
      .innerJoinAndSelect('student.subjects', 'subjects')
      .paginate(10);
  }

  public async create(student: Student): Promise<Student> {
    return await this.studentRepository.save(student);
  }

  public async update(newStudent: Student): Promise<Student | undefined> {
    const student = await this.studentRepository.findOneOrFail(newStudent.id);
    if (!student.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Student not found',
          })
        }, 250);
      })
    }
    await this.studentRepository.update(newStudent.id, newStudent);
    return await this.studentRepository.findOne(newStudent.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.studentRepository.delete(id);
  }
}
