import { Router } from 'express';

import ModalidadController from './../../controllers/ModalidadController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', ModalidadController.listAll);
router.post('/',ModalidadController.newModalidad);
router.get('/:id',ModalidadController.getOneById);
router.patch('/:id',ModalidadController.editModalidad);

export default router;
