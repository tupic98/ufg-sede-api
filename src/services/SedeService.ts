import { DeleteResult, Repository } from 'typeorm';
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
    return await this.sedeRepository.findOneOrFail(id, {
      select: ['id', 'logo', 'name', 'address', 'code'],
    });
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.sedeRepository
      .createQueryBuilder('sede')
      .paginate(10);
  }

  public async create(sede: Sede): Promise<Sede> {
    return await this.sedeRepository.save(sede);
  }

  public async update(newSede: Sede): Promise<Sede | undefined> {
    const sede = await this.sedeRepository.findOneOrFail(newSede.id);
    if (!sede.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Sede not found',
          });
        }, 250);
      });
    }
    await this.sedeRepository.update(newSede.id, newSede);
    return await this.sedeRepository.findOne(newSede.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.sedeRepository.delete(id);
  }
}
