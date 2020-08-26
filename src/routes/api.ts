import { Router } from 'express';
import AuthRouter from './api/AuthRouter';
import UserRouter from './api/UserRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);

export default router;
