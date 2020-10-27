import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { User } from '../entities/User';
import { Person } from '../entities/Person';
import { RoleService } from '../services/RoleService';
import { SedeService } from '../services/SedeService';
import { SubjectService } from '../services/SubjectService';
import { UserService } from '../services/UserService';
import { Container } from "typedi";

class UserController {
  static fetch = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    //Get users from database
    const users = await userService.findAll();
    res.status(200).send(users);
  };

  static show = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    //Get the ID from the url
    const id: number = Number(req.params.id);

    //Get the user from database
      const user = await userService.findById(id);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado '});
        return;
      }
      res.status(200).send(user);
  };

  static store = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    const subjectService = Container.get(SubjectService);
    const sedeService = Container.get(SedeService);
    const roleService = Container.get(RoleService);
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

  static update = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    const subjectService = Container.get(SubjectService);
    const sedeService = Container.get(SedeService);
    const roleService = Container.get(RoleService);
    const id = Number(req.params.id);

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

    //Getting user information
    const user = await userService.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado '})
      return;
    }

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

    user.person.username = username;
    user.person.firstName = firstName;
    user.person.lastName = lastName;
    user.person.status = status;
    user.person.email = email;
    user.person.phoneNumber = phoneNumber;
    user.person.altPhoneNumber = altPhoneNumber;
    user.person.sede = sede;


    //Validate person entity
    const personErrors = await validate(user.person);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    if (password) {
      user.password = password;
    }
    user.subject = subject;
    user.role = role;

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    if (password) {
      await user.hashPassword();
    }

    try {
      await userService.update(user);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el usuario '});
      return;
    }

    res.status(200).send('Usuario actualizado correctamente');
  };

  static destroy = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    const id: number = Number(req.params.id);

    const user = await userService.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado '})
    }

    await userService.delete(id);
    res.status(204).send();
  };
}

export default UserController;
