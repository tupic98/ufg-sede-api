import { Repository } from "typeorm";
import { Permission } from "../entities/Permission";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    protected permissionRepository: Repository<Permission>,
  ) {}

  public async findById(id: number): Promise<Permission | undefined> {
    return await this.permissionRepository.findOneOrFail(id);
  }

  public async findByIds(ids: Array<number>): Promise<Permission[]> {
    return await this.permissionRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Permission | undefined> {
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.name = :name', { name })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .paginate(10);
  }
}
