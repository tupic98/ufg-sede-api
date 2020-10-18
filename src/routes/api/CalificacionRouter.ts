import { Router } from 'express';

import CalificacionController from '../../controllers/CalificacionController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', CalificacionController.listAll);
router.post('/',CalificacionController.newCalificacion);
router.get('/:id',CalificacionController.getById);
router.patch('/:id',CalificacionController.editCalificacion);

export default router;
