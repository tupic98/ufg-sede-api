import { InsertResult, Repository } from 'typeorm';
import { Service } from 'typedi';
import { InjectRepository } from "typeorm-typedi-extensions";
import { SubjectToStudent } from '../entities/SubjectToStudent';

@Service()
export class SubjectToStudentService {
  constructor(
      @InjectRepository(SubjectToStudent)
      protected repository: Repository<SubjectToStudent>
  ) {
  }

  public async findByStudentAndSubject(studentId: number, subjectId: number): Promise<SubjectToStudent | undefined> {
    return await this.repository.createQueryBuilder('subjectxstudent')
        .leftJoin('subjectxstudent.student', 'student')
        .leftJoin('subjectxstudent.subject', 'subject')
        .where('student.id = :id', { id: studentId })
        .andWhere('subject.id = :id', { id: subjectId })
        .getOne()
  }

  public async createVarious(subjectToStudent: SubjectToStudent[]): Promise<InsertResult> {
    return await this.repository.createQueryBuilder('subjectxstudent')
        .insert()
        .into(SubjectToStudent)
        .values(subjectToStudent)
        .execute();
  }

  public async create(subjectToStudent: SubjectToStudent): Promise<InsertResult> {
    return await this.repository.createQueryBuilder('subjectxstudent')
        .insert()
        .into(SubjectToStudent)
        .values(subjectToStudent)
        .execute();
  }
}
