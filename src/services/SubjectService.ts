import { Repository, DeleteResult } from 'typeorm';
import { Subject } from '../entities/Subject';
import { Service } from 'typedi';
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    protected subjectRepository: Repository<Subject>
  ) { }

  public async findById(id: number): Promise<Subject | undefined> {
    return await this.subjectRepository.findOneOrFail(id, {
      select: ['id', 'name', 'grade', 'users'],
    });
  }

  public async findByIds(ids: Array<number>): Promise<Subject[]> {
    return await this.subjectRepository.findByIds(ids);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.subjectRepository
      .createQueryBuilder('subject')
      .innerJoinAndSelect('subject.grade', 'grade')
      .innerJoinAndSelect('subject.users', 'users')
      .paginate(10);
  }

  public async create(subject: Subject): Promise<Subject> {
    return await this.subjectRepository.save(subject);
  }

  public async update(newSubject: Subject): Promise<Subject | undefined> {
    const subject = await this.subjectRepository.findOneOrFail(newSubject.id);
    if (!subject.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Subject not found',
          })
        }, 250);
      });
    }
    await this.subjectRepository.update(newSubject.id, newSubject);
    return await this.subjectRepository.findOne(newSubject.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.subjectRepository.delete(id);
  }
}
