import { Repository } from "typeorm";
import { Permission } from "../entities/Permission";

export class PermissionService {
  constructor(
    private readonly permissionRespository: Repository<Permission>,
  ) {}

  public async findById(id: number): Promise<Permission | undefined> {
    return await this.permissionRespository.findOneOrFail(id);
  }

  public async findByIds(ids: Array<number>): Promise<Permission[]> {
    return await this.permissionRespository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Permission | undefined> {
    return await this.permissionRespository
      .createQueryBuilder('permission')
      .where('permission.name = :name', { name })
      .getOne();
  }

  public async findAll(): Promise<Permission[]> {
    return await this.permissionRespository.find();
  }
}