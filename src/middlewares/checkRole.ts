import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.jwtPayload.role;

    // const userRepository = getRepository(User);
    // let user: User;

    // try {
    //   user = await userRepository.findOneOrFail(id, { relations: ['role'] });
    // } catch (error) {
    //   res.sendStatus(401);
    //   return;
    // }

    if (roles.indexOf(role) > -1) next();
    else res.status(401).send();
  };
};
