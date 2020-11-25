import { Subject } from './../entities/Subject';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
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
    return await this.subjectRepository.findOne(id);
  }

  public async findByIdWithRelation(id: number): Promise<Subject | undefined> {
    return await this.subjectRepository
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.grade', 'grade')
      .leftJoinAndSelect('subject.users', 'users')
      .where('subject.id = :id', { id })
      .getOne();
  }

  public async findByIds(ids: Array<number>): Promise<Subject[]> {
    return await this.subjectRepository.findByIds(ids);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.subjectRepository
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.grade', 'grade')
      .leftJoinAndSelect('subject.users', 'users')
      .orderBy('subject.id', "ASC")
      .paginate(10);
  }

  public async create(subject: Subject): Promise<Subject> {
    return await this.subjectRepository.save(subject);
  }

  public async update(newSubject: Subject): Promise<UpdateResult> {
    return await this.subjectRepository.update(newSubject.id, newSubject);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.subjectRepository.delete(id);
  }
}
