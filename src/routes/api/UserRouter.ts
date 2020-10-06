import { Router } from 'express';
import { checkJWT } from '../../middlewares/checkJWT';
import { checkRole } from '../../middlewares/checkRole';
import UserController from '../../controllers/UserController';
// import UserController from './../../controllers/UserController';
// import { checkJWT } from './../../middlewares/checkJWT';
// import { checkRole } from './../../middlewares/checkRole';

const router: Router = Router();
router.post('/', [checkJWT, checkRole(['admin'])], UserController.newUser)
// router.get(
//   '/',
//   [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
//   UserController.listAll
// );
// router.get(
//   '/:id',
//   [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
//   UserController.getOneById
// );
// router.patch(
//   '/:id',
//   [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
//   UserController.editUser
// );
// router.delete(
//   '/:id',
//   [checkJWT, checkRole(['DIRECTOR', 'ADMIN'])],
//   UserController.deleteUser
// );

export default router;
