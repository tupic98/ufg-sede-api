import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { StudentService } from '../services/StudentService';

export const checkStudentCode = async (req: Request, res: Response, next: NextFunction) => {
  const code = res.locals.jwtPayload.code;
  const studentService = Container.get(StudentService);

  const student = await studentService.findByCode(code);
  if (!student) {
    res.sendStatus(401);
    return;
  }
  next();
}
