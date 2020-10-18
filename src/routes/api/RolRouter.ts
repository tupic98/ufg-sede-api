import { Router } from 'express';

import RolController from './../../controllers/RolController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', RolController.listAll);
router.post('/',RolController.newRol);
router.get('/:id',RolController.getOneById);
router.patch('/:id',RolController.editRol);

export default router;
