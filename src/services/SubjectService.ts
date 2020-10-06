import { Repository } from 'typeorm';
import { Subject } from '../entities/Subject';

export class SubjectService {
  constructor(
    private readonly subjectRepository: Repository<Subject>,
  )

  public async findById()
}