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
    return await this.roleRepository.findOneOrFail(id, {
      select: ['id', 'name', 'type', 'permissions', 'users'],
    });
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .innerJoinAndSelect('role.permissions', 'permissions')
      .innerJoinAndSelect('role.users', 'users')
      .paginate(10);
  }

  public async create(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  public async update(newRole: Role): Promise<Role | undefined> {
    const role = await this.roleRepository.findOneOrFail(newRole.id);
    if (!role.id) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            statusCode: 404,
            error: 'Role not found',
          })
        }, 250);
      })
    }
    await this.roleRepository.update(newRole.id, newRole);
    return await this.roleRepository.findOne(newRole.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }
}
