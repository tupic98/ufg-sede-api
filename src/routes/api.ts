import { Router } from 'express';
import AuthRouter from './api/AuthRouter';
import UserRouter from './api/UserRouter';
import SedeRouter from './api/SedeRouter';
import PersonaRouter from './api/PersonaRouter';
import MateriaRouter from './api/MateriaRouter';
import GradoRouter from './api/GradoRouter';
import UsuarioRouter from './api/UsuarioRouter';
import RolRouter from './api/RolRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/sede', SedeRouter);
router.use('/persona', PersonaRouter);
router.use('/materia', MateriaRouter);
router.use('/grado', GradoRouter);
router.use('/usuario', UsuarioRouter);
router.use('/rol', RolRouter);

export default router;
