import {Grade} from "../entities/Grade";
import { DeleteResult, Repository } from "typeorm";
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
    return await this.gradeRepository.findOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.gradeRepository
      .createQueryBuilder('grade')
      .innerJoinAndSelect('grade.subjects', 'subjects')
      .innerJoinAndSelect('grade.students', 'students')
      .paginate(10);
  }

  public async create(grade: Grade): Promise<Grade> {
    return await this.gradeRepository.save(grade);
  }

  public async update(newGrade: Grade): Promise<Grade | undefined> {
    const grade = await this.gradeRepository.findOneOrFail(newGrade.id);
    if (!grade.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Grade not found',
          })
        }, 250);
      })
    }
    await this.gradeRepository.update(newGrade.id, newGrade);
    return await this.gradeRepository.findOne(newGrade.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.gradeRepository.delete(id);
  }
}
