import { checkStudentJWT } from '../middlewares/checkStudentJWT';
import { checkStudentCode } from '../middlewares/checkStudentCode';
import { Router } from 'express';
import AdminRouter from './api/admin';
import AuthRouter from './api/AuthRouter';
import StudentController from './../controllers/StudentController';
import SedeController from "../controllers/SedeController";
import ModuleController from "../controllers/ModuleController";

const router: Router = Router();

router.use('/admin', AdminRouter);
router.use('/auth', AuthRouter);
router.get('/student/notes', [checkStudentJWT, checkStudentCode], StudentController.showByCode);
router.get('/student/me', [checkStudentJWT, checkStudentCode], StudentController.me);
router.post('/student/contact', [checkStudentJWT, checkStudentCode], StudentController.updateContact);
router.get('/sede-information', SedeController.show);
router.get('/modules', ModuleController.list);

export default router;
