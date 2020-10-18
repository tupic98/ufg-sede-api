import { Router } from 'express';
import ModuloController from '../../controllers/ModuloController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', ModuloController.listAll);
router.post('/',ModuloController.newModulo);
router.get('/:id',ModuloController.getOneById);
router.patch('/:id',ModuloController.editModulo);

export default router;
