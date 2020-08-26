import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from './../entities/User';

export class CreateAdminUser1598324912066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.email = 'rv.rosales@gmail.com';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'DIRECTOR';
    const userRepository = getRepository(User);
    await userRepository.save(user);

    let admin = new User();
    user.email = 'raalvarenga423@gmail.com';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    await userRepository.save(admin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
