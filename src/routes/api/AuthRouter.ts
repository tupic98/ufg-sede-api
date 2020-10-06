import { Router } from 'express';
import AuthController from './../../controllers/AuthController';
// import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

router.post('/login', AuthController.login);
// router.post('/reset', [checkJWT], AuthController.changePassword);

export default router;
