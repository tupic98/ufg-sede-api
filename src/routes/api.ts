import { Router } from 'express';
import AuthRouter from './api/AuthRouter';
import UserRouter from './api/UserRouter';
import SubjectRouter from './api/SubjectRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/subjects', SubjectRouter);

export default router;
