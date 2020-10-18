import { Router } from 'express';

import AlumnoController from '../../controllers/AlumnoController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', AlumnoController.listAll);
router.post('/',AlumnoController.newAlumno);
router.get('/:id',AlumnoController.getOneById);
router.delete('/:id',AlumnoController.deleteById);

export default router;
