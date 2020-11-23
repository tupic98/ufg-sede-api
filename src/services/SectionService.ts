import {DeleteResult, Repository} from "typeorm";
import {Section} from "../entities/Section";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    protected sectionRepository: Repository<Section>,
  ) { }

  public async findById(id: number): Promise<Section | undefined> {
    return await this.sectionRepository.findOneOrFail(id);
  }

  public async findByIdWithRelations(id: number): Promise<Section | undefined> {
    return await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.students', 'students')
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.sectionRepository
      .createQueryBuilder('section')
      .innerJoinAndSelect('section.students', 'students')
      .paginate(10);
  }

  public async create(section: Section): Promise<Section> {
    return await this.sectionRepository.save(section);
  }

  public async update(newSection: Section): Promise<Section | undefined> {
    const section = await this.sectionRepository.findOneOrFail(newSection.id);
    if (!section.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Section not found',
          })
        }, 250);
      })
    }
    await this.sectionRepository.update(newSection.id, newSection);
    return await this.sectionRepository.findOne(newSection.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.sectionRepository.delete(id);
  }
}
