import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Module } from "../entities/Module";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    protected moduleRepository: Repository<Module>
  ) { }

  public async findById(id: number): Promise<Module | undefined> {
    return await this.moduleRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.moduleRepository
      .createQueryBuilder('module')
      .paginate(10);
  }

  public async create(module: Module): Promise<Module> {
    return await this.moduleRepository.save(module);
  }

  public async update(newModule: Module): Promise<UpdateResult> {
    return await this.moduleRepository.update(newModule.id, newModule);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.moduleRepository.delete(id);
  }
}
