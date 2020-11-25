import {DeleteResult, Repository, UpdateResult} from "typeorm";
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
    return await this.modalityRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.modalityRepository
      .createQueryBuilder('modality')
      .paginate(10);
  }

  public  async create(modality: Modality): Promise<Modality> {
    return await this.modalityRepository.save(modality);
  }

  public async update(newModality: Modality): Promise<UpdateResult> {
    return await this.modalityRepository.update(newModality.id, newModality);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.modalityRepository.delete(id);
  }
}
