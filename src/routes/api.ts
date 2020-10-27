import { Router } from 'express';
import AdminRouter from './api/admin';
import AuthRouter from './api/AuthRouter';

const router: Router = Router();

router.use('/admin', AdminRouter);
router.use('/auth', AuthRouter);

export default router;
