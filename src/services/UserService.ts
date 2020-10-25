import { Repository, DeleteResult } from "typeorm";
import { User } from "../entities/User";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

@Service()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}

  public async findByUsernameWithRole(username: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .innerJoinAndSelect('user.person', 'person')
      .where('person.username = :username', { username })
      .getOne();
  }

  public async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneOrFail(id, {
        select: ['id', 'role', 'person', 'subject'],
    });
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .innerJoinAndSelect('user.person', 'person')
      .innerJoinAndSelect('user.subject', 'subject')
      .paginate(10);
  }

  public async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async update(newUser: User): Promise<User | undefined> {
    const user = await this.userRepository.findOneOrFail(newUser.id);
    if (!user.id) {
      return new Promise((resolve, reject) => {
          setTimeout(function () {
            reject({
                statusCode: 404,
                error: 'User not found',
            });
          }, 250);
      });
    }
    await this.userRepository.update(newUser.id, newUser);
    return await this.userRepository.findOne(newUser.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
