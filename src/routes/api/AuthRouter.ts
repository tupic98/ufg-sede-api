import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const router: Router = Router();

router.post('/login', AuthController.loginStudent);

export default router;
