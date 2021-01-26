import {DeleteResult, Repository, UpdateResult} from "typeorm";
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
    return await this.sectionRepository.findOne(id);
  }

  public async findByIdWithRelations(id: number): Promise<Section | undefined> {
    return await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.students', 'students')
      .where('section.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.students', 'students')
      .paginate(10);
  }

  public async listAll(): Promise<Section[]> {
    return await this.sectionRepository
        .createQueryBuilder('section')
        .getMany();
  }

  public async create(section: Section): Promise<Section> {
    return await this.sectionRepository.save(section);
  }

  public async update(newSection: Section): Promise<UpdateResult> {
    return await this.sectionRepository.update(newSection.id, newSection);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.sectionRepository.delete(id);
  }
}
