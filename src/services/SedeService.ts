import { DeleteResult, Repository } from 'typeorm';
import { Sede } from '../entities/Sede';

export class SedeService {
  constructor(private readonly sedeRepository: Repository<Sede>) {}

  public async findById(id: number): Promise<Sede | undefined> {
    return await this.sedeRepository.findOneOrFail(id);
  }

  public async findAll(): Promise<Sede[]> {
    return await this.sedeRepository.find();
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
