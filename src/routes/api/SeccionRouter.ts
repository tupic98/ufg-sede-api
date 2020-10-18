import { Router } from 'express';
import SeccionController from '../../controllers/SeccionController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', SeccionController.listAll);
router.post('/',SeccionController.newSeccion);
router.get('/:id',SeccionController.getOneById);
router.patch('/:id',SeccionController.editSeccion);

export default router;
