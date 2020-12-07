import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../config/config';

export const checkStudentJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = <string>req.headers['authorization'];
  let jwtPayload;

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.sendStatus(401);
    return;
  }
  const { studentId, code } = jwtPayload;
  const newToken = jwt.sign({ studentId, code }, config.jwtSecret, {
    expiresIn: '1h',
  })
  res.setHeader('token', newToken);
  next();
}
