import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Qualification } from "../entities/Qualification";
import { DeleteResult, Repository } from "typeorm";
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
    return await this.qualificationRepository.findOneOrFail(id, {
      select: [
        'id',
        'note',
        'recoverEnabled',
        'isExternalTest',
        'recoverLink',
        'approved',
        'subject',
        'module',
        'createdAt',
        'updatedAt',
        'updatedBy',
      ]
    })
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

  public async update(newQualification: Qualification): Promise<Qualification | undefined> {
    const qualification = await this.qualificationRepository.findOneOrFail(newQualification);
    if (!qualification.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Qualification not found',
          })
        }, 250);
      });
    }
    await this.qualificationRepository.update(newQualification.id, newQualification);
    return await this.qualificationRepository.findOne(newQualification.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.qualificationRepository.delete(id);
  }
}
