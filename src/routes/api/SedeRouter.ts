import { Router } from 'express';

import SedeController from './../../controllers/SedeController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', SedeController.listAll);
router.post('/',SedeController.newSede);
router.get('/:id',SedeController.getOneById);
router.patch('/:id',SedeController.editSede);
//router.post('/reset', [checkJWT], AuthController.changePassword);

export default router;
