import { Repository, DeleteResult } from 'typeorm';
import { Subject } from '../entities/Subject';

export class SubjectService {
  constructor(
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  public async findById(id: number): Promise<Subject | undefined> {
    return await this.subjectRepository.findOneOrFail(id);
  }

  public async findAll(): Promise<Subject[]> {
    return await this.subjectRepository.find();
  }

  public async create(subject: Subject): Promise<Subject> {
    return await this.subjectRepository.save(subject);
  }

  public async update(newSuject: Subject): Promise<Subject | undefined> {
    const subject = await this.subjectRepository.findOneOrFail(newSuject.id);
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
    await this.subjectRepository.update(newSuject.id, newSuject);
    return await this.subjectRepository.findOne(newSuject.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.subjectRepository.delete(id);
  }
}