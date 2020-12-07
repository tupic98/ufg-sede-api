import { checkStudentJWT } from './../middlewares/checkStudentJWT';
import { checkStudentCode } from './../middlewares/checkStudentCode';
import { Router } from 'express';
import AdminRouter from './api/admin';
import AuthRouter from './api/AuthRouter';
import StudentController from './../controllers/StudentController';

const router: Router = Router();

router.use('/admin', AdminRouter);
router.use('/auth', AuthRouter);
router.get('/notes', [checkStudentJWT, checkStudentCode], StudentController.showByCode);

export default router;
