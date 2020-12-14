import {DeleteResult, Repository, UpdateResult} from "typeorm";
import { Person } from "../entities/Person";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
    ) { }

    public async findById(id: number): Promise<Person | undefined> {
        return await this.personRepository
            .createQueryBuilder('person')
            .where('person.id = :id', { id })
            .getOne();
    }

    public async findByIdWithRelation(id: number): Promise<Person | undefined> {
        return await this.personRepository
            .createQueryBuilder('person')
            .where('person.id = :id', { id })
            .leftJoinAndSelect('person.sede', 'sede')
            .getOne();
    }

    public async findAll(): Promise<PaginationAwareObject> {
        return await this.personRepository
            .createQueryBuilder('person')
            .leftJoinAndSelect('person.sede', 'sede')
            .paginate(10);
    }

    public async create(person: Person): Promise<Person> {
        return await this.personRepository.save(person);
    }

    public async update(newPerson: Person): Promise<UpdateResult> {
        return await this.personRepository.update(newPerson.id, newPerson);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.personRepository.delete(id);
    }
}
