import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from './../entities/User';
import config from './../../config/config';

class AuthController {
  static login = async (req: Request, res: Response) => {
    // Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.sendStatus(400);
    }

    // Get user form database
    const userRepository = getRepository(User);
    let user: User | undefined;

    try {
      user = await userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.person', 'person')
        .where('person.username = :username', { username })
        .getOne();
    } catch (error) {
      res.sendStatus(401);
      return;
    }

    if (!user) {
      res
        .status(400)
        .json({ message: 'El usuario que intenta ingresar no existe' });
      return;
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).json({ message: 'La contraseña no es valida' });
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.person.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static signUp = async (req: Request, res: Response) => {
    
  }

  // static changePassword = async (req: Request, res: Response) => {
  //   //Get ID from JWT
  //   const id = res.locals.jwtPayload.userId;

  //   //Get parameters from the body
  //   const { oldPassword, newPassword } = req.body;
  //   if (!(oldPassword && newPassword)) {
  //     res.sendStatus(400);
  //     return;
  //   }

  //   const userRepository = getRepository(User);
  //   let user: User;
  //   try {
  //     user = await userRepository.findOneOrFail(id);
  //   } catch (error) {
  //     res.sendStatus(401);
  //     return;
  //   }

  //   // Check if old password matchs
  //   if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
  //     res.sendStatus(401);
  //     return;
  //   }

  //   //Validate model (password length)
  //   user.password = newPassword;
  //   const errors = await validate(user);
  //   if (errors.length > 0) {
  //     res.status(400).send(errors);
  //   }

  //   user.hashPassword();
  //   userRepository.save(user);

  //   res.sendStatus(204);
  // };
}

export default AuthController;
