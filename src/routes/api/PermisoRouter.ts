import { Router } from 'express';

import PermisoController from './../../controllers/PermisoController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', PermisoController.listAll);
router.post('/',PermisoController.newPermiso);
router.get('/:id',PermisoController.getOneById);
router.patch('/:id',PermisoController.editPermiso);

export default router;
