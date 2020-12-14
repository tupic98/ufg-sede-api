import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Sede } from '../entities/Sede';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class SedeService {
  constructor(
    @InjectRepository(Sede)
    protected sedeRepository: Repository<Sede>
  ) { }

  public async findById(id: number): Promise<Sede | undefined> {
    return await this.sedeRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.sedeRepository
      .createQueryBuilder('sede')
      .paginate(10);
  }

  public async listAll(): Promise<Sede[]> {
    return await this.sedeRepository
        .createQueryBuilder('sede')
        .getMany()
  }

  public async create(sede: Sede): Promise<Sede> {
    return await this.sedeRepository.save(sede);
  }

  public async update(newSede: Sede): Promise<UpdateResult> {
    return await this.sedeRepository.update(newSede.id, newSede);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.sedeRepository.delete(id);
  }
}
