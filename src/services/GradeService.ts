import {Grade} from "../entities/Grade";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    protected gradeRepository: Repository<Grade>
  ) { }

  public async findById(id: number): Promise<Grade | undefined> {
    return await this.gradeRepository.findOne(id);
  }

  public async findByIdWithRelations(id: number): Promise<Grade | undefined> {
    return await this.gradeRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.subjects', 'subjects')
      .loadRelationCountAndMap('grade.studentCount', 'grade.students')
      .where('grade.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.gradeRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.subjects', 'subjects')
      .loadRelationCountAndMap('grade.studentCount', 'grade.students')
      .paginate(10);
  }

  public async create(grade: Grade): Promise<Grade> {
    return await this.gradeRepository.save(grade);
  }

  public async update(newGrade: Grade): Promise<UpdateResult> {
    return await this.gradeRepository.update(newGrade.id, newGrade);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.gradeRepository.delete(id);
  }
}
