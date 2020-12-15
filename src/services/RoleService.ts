import { DeleteResult, Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    protected roleRepository: Repository<Role>,
  ) { }

  public async findById(id: number): Promise<Role | undefined> {
    return await this.roleRepository.createQueryBuilder('role')
        .where('role.id = :id', { id })
        .getOne();
  }

  public async findByIdWithRelations(id: number): Promise<Role | undefined> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .paginate(10);
  }

  public async listAll(): Promise<Role[]> {
    return await this.roleRepository
        .createQueryBuilder('role')
        .getMany();
  }

  public async create(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  public async update(newRole: Role): Promise<Role> {
    return await this.roleRepository.save(newRole);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }
}
