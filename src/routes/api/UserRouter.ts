import { Router } from 'express';
import UserController from './../../controllers/UserController';
import { checkJWT } from './../../middlewares/checkJWT';
import { checkRole } from './../../middlewares/checkRole';

const router: Router = Router();

router.get(
  '/',
  [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
  UserController.listAll
);
router.get(
  '/:id',
  [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
  UserController.getOneById
);
router.post(
  '/',
  [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
  UserController.newUser
);
router.patch(
  '/:id',
  [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
  UserController.editUser
);
router.delete(
  '/:id',
  [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
  UserController.deleteUser
);

export default router;
