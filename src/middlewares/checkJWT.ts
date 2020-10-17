import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from './../../config/config';

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token authorization from headers
  const token = <string>req.headers.authorization;
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  const { userId, email } = jwtPayload;
  const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  next();
};
