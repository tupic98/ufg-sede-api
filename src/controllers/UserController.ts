import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from './../entities/User';

class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'email', 'role'],
    });

    res.status(200).send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = Number(req.params.id);

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ['id', 'email', 'role'],
      });
      res.status(200).send(user);
    } catch (error) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { email, password, role } = req.body;
    let user = new User();
    user.email = email;
    user.password = password;
    user.role = role;

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Hash the password, to securely store on DB
    user.hashPassword();

    // Try to save. If it fails, the email is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send('Email already in use');
      return;
    }

    //If everything is ok, send 201 response
    res.status(201).send('User created');
  };

  static editUser = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { email, role } = req.body;

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('User not found');
      return;
    }

    // Validate the new values on model
    user.email = email;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to save, if it fails, that means the email is already in use
    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send('Email already in use');
      return;
    }
    //If everything ok, send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    if (user.role === 'DIRECTOR') {
      res.status(400).send('User cannot be deleted');
      return;
    }
    userRepository.delete(id);

    res.status(204).send();
  };
}

export default UserController;
