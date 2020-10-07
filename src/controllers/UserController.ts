import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from './../entities/User';
import { Person } from './../entities/Person';
import { RoleService } from '../services/RoleService';
import { SedeService } from '../services/SedeService';
import { SubjectService } from '../services/SubjectService';
import { UserService } from '../services/UserService';
import { Role } from '../entities/Role';
import { Sede } from '../entities/Sede';
import { Subject } from '../entities/Subject';

const roleService = new RoleService(getRepository(Role));
const sedeService = new SedeService(getRepository(Sede));
const subjectService = new SubjectService(getRepository(Subject));
const userService = new UserService(getRepository(User));

class UserController {
  // static listAll = async (req: Request, res: Response) => {
  //   //Get users from database
  //   const userRepository = getRepository(User);
  //   const users = await userRepository.find({
  //     select: ['id', 'email', 'role'],
  //   });

  //   res.status(200).send(users);
  // };

  // static getOneById = async (req: Request, res: Response) => {
  //   //Get the ID from the url
  //   const id: number = Number(req.params.id);

  //   //Get the user from database
  //   const userRepository = getRepository(User);
  //   try {
  //     const user = await userRepository.findOneOrFail(id, {
  //       select: ['id', 'email', 'role'],
  //     });
  //     res.status(200).send(user);
  //   } catch (error) {
  //     res.status(404).json({
  //       message: 'User not found',
  //     });
  //     return;
  //   }
  // };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    const {
      username,
      email,
      phoneNumber,
      altPhoneNumber,
      password,
      roleId,
      firstName,
      lastName,
      sedeId,
      status,
      subjectId,
    }: {
      username: string;
      password: string;
      email: string;
      phoneNumber: string;
      altPhoneNumber: string;
      roleId: number;
      firstName: string;
      lastName: string;
      sedeId: number;
      status: boolean;
      subjectId: number;
    } = req.body;

    //Getting role information
    const role = await roleService.findById(roleId);
    if (!role) {
      res.status(400).json({ message: 'El rol que intenta asignar no existe' });
      return;
    }

    //Getting sede information
    const sede = await sedeService.findById(sedeId);
    if (!sede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    //Getting subject information
    const subject = await subjectService.findById(subjectId);
    if (!subject) {
      res.status(400).json({ message: 'La materia que intenta asignar no existe' });
      return;
    }
    //Setting person information
    const person = new Person();
    person.username = username;
    person.firstName = firstName;
    person.lastName = lastName;
    person.status = status;
    person.email = email;
    person.phoneNumber = phoneNumber;
    person.altPhoneNumber = altPhoneNumber;
    person.sede = sede;

    //Validate person entity
    const personErrors = await validate(person);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    const user = new User();
    user.password = password;
    user.subject = subject;
    user.person = person;
    user.role = role;

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    await user.hashPassword();

    // Try to save.
    try {
      await userService.create(user);
    } catch (error) {
      res.status(400).json({ message: 'No se pudo crear el usuario' });
      return;
    }

    //If everything is ok, send 201 response
    res.status(201).send('Usuario creado correctamente');
  };

  // static editUser = async (req: Request, res: Response) => {
  //   // Get the ID from the url
  //   const id = req.params.id;

  //   //Get values from the body
  //   const { email, role } = req.body;

  //   //Try to find user on database
  //   const userRepository = getRepository(User);
  //   let user;
  //   try {
  //     user = await userRepository.findOneOrFail(id);
  //   } catch (error) {
  //     //If not found, send a 404 response
  //     res.status(404).send('User not found');
  //     return;
  //   }

  //   // Validate the new values on model
  //   user.email = email;
  //   user.role = role;
  //   const errors = await validate(user);
  //   if (errors.length > 0) {
  //     res.status(400).send(errors);
  //     return;
  //   }

  //   // Try to save, if it fails, that means the email is already in use
  //   try {
  //     await userRepository.save(user);
  //   } catch (error) {
  //     res.status(409).send('Email already in use');
  //     return;
  //   }
  //   //If everything ok, send a 204 (no content, but accepted) response
  //   res.status(204).send();
  // };

  // static deleteUser = async (req: Request, res: Response) => {
  //   //Get the ID from the url
  //   const id = req.params.id;

  //   const userRepository = getRepository(User);
  //   let user: User;
  //   try {
  //     user = await userRepository.findOneOrFail(id);
  //   } catch (error) {
  //     res.status(404).send('User not found');
  //     return;
  //   }
  //   if (user.role === 'DIRECTOR') {
  //     res.status(400).send('User cannot be deleted');
  //     return;
  //   }
  //   userRepository.delete(id);

  //   res.status(204).send();
  // };
}

export default UserController;
