import { Router } from 'express';
import AuthRouter from './admin/AuthRouter';
import UserRouter from './admin/UserRouter';
import SubjectRouter from './admin/SubjectRouter';
import GradeRouter from './admin/GradeRouter';
import ModalityRouter from './admin/ModalityRouter';
import SedeRouter from './admin/SedeRouter';
import ModuleRouter from './admin/ModuleRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/modality', ModalityRouter);
router.use('/subjects', SubjectRouter);
router.use('/grades', GradeRouter);
router.use('/sede', SedeRouter);
router.use('/module', ModuleRouter);

export default router;
