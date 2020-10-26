import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Module } from "../entities/Module";
import { DeleteResult, Repository } from "typeorm";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    protected moduleRepository: Repository<Module>
  ) { }

  public async findById(id: number): Promise<Module | undefined> {
    return await this.moduleRepository.findOneOrFail(id, {
      select: ['id', 'moduleNumber']
    })
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.moduleRepository
      .createQueryBuilder('module')
      .paginate(10);
  }

  public async create(module: Module): Promise<Module> {
    return await this.moduleRepository.save(module);
  }

  public async update(newModule: Module): Promise<Module | undefined> {
    const module = await this.moduleRepository.findOneOrFail(newModule.id);
    if (!module.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Module not found',
          })
        }, 250);
      });
    }
    await this.moduleRepository.update(newModule.id, newModule);
    return await this.moduleRepository.findOne(newModule.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.moduleRepository.delete(id);
  }
}
