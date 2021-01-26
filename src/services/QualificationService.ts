import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Qualification } from "../entities/Qualification";
import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class QualificationService {
  constructor (
    @InjectRepository(Qualification)
    protected qualificationRepository: Repository<Qualification>
  ) { }

  public async findAllByStudent(studentId: string): Promise<PaginationAwareObject> {
    return await this.qualificationRepository
      .createQueryBuilder('qualification')
      .innerJoinAndSelect('qualification.module', 'module')
      .innerJoinAndSelect('qualification.subject', 'subject')
      .innerJoin('subject.students', 'subjectStudent', 'subjectStudent.id = :studentId', { studentId })
      .paginate(10);
  }

  public async findById(id: number): Promise<Qualification | undefined> {
    return await this.qualificationRepository.findOneOrFail(id)
  }

  public async findByIdWithRelations(id: number): Promise<Qualification | undefined> {
    return await this.qualificationRepository
        .createQueryBuilder('qualification')
        .leftJoinAndSelect('qualification.subjectStudent', 'qualification.subjectStudent')
        .leftJoinAndSelect('qualification.module', 'module')
        .where('qualification.id = :id', { id })
        .getOne()
  }

  public async findByIds(ids: Array<number>): Promise<Qualification[]> {
    return await this.qualificationRepository.findByIds(ids);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.qualificationRepository
      .createQueryBuilder('qualification')
      .innerJoinAndSelect('qualification.subject', 'subject')
      .innerJoinAndSelect('qualification.module', 'module')
      .paginate(10);
  }

  public async create(qualification: Qualification): Promise<Qualification> {
    return await this.qualificationRepository.save(qualification);
  }

  public async createVarious(qualifications: Qualification[]): Promise<InsertResult> {
    return await this.qualificationRepository.createQueryBuilder('qualification')
        .insert()
        .into(Qualification)
        .values(qualifications)
        .execute();
  }

  public async update(newQualification: Qualification): Promise<UpdateResult> {
    return await this.qualificationRepository.update(newQualification.id, newQualification);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.qualificationRepository.delete(id);
  }
}
