import {DeleteResult, Repository} from "typeorm";
import {Modality} from "../entities/Modality";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class ModalityService {
  constructor(
    @InjectRepository(Modality)
    protected modalityRepository: Repository<Modality>,
  ) { }

  public async findById(id: number): Promise<Modality | undefined> {
    return await this.modalityRepository.findOneOrFail(id, {
      select: ['id', 'type']
    });
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.modalityRepository
      .createQueryBuilder('modality')
      .paginate(10);
  }

  public  async create(modality: Modality): Promise<Modality> {
    return await this.modalityRepository.save(modality);
  }

  public async update(newModality: Modality): Promise<Modality | undefined> {
    const modality = await this.modalityRepository.findOneOrFail(newModality.id);
    if (!modality.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Modality not found',
          })
        }, 250);
      })
    }
    await this.modalityRepository.update(newModality.id, newModality);
    return await this.modalityRepository.findOne(newModality.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.modalityRepository.delete(id);
  }
}
