import { DeleteResult, Repository } from 'typeorm';
import { Role } from '../entities/Role';

export class RoleService {
  constructor(
    private readonly roleRepository: Repository<Role>,
  ) { }

  public async findById(id: number): Promise<Role | undefined> {
    return await this.roleRepository.findOneOrFail(id);
  }

  public async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
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