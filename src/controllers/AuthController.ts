import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from './../../config/config';
import { UserService } from '../services/UserService';
import { Container } from "typedi";
import { StudentService } from '../services/StudentService';

class AuthController {
  static login = async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    // Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.sendStatus(400);
    }

    // Get user form database

    const user = await userService.findByUsernameWithRole(username);
    if (!user) {
      res.send(400).json({ message: 'Usuario incorrecto' });
      return
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).json({ message: 'La contraseña no es valida' });
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.person.username, role: user.role.name },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static signUp = async (req: Request, res: Response) => {

  }

  static loginStudent = async (req: Request, res: Response) => {
    const studentService = Container.get(StudentService);
    const { code }: { code: string } = req.body;
    if (!code) {
      res.status(400).json({ message: 'El código del estudiante es requerido' });
    }

    const student = await studentService.findByCode(code);
    if (!student) {
      res.send(400).json({ message: 'El código del estudiante es incorrecto' });
      return;
    }

    const token = jwt.sign(
      { studentId: student.id, code: student.code },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.send(token);
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
