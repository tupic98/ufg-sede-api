import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from './../entities/User';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.sendStatus(401);
      return;
    }

    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
