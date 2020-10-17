import { Router } from 'express';

import GradoController from './../../controllers/GradoController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', GradoController.listAll);
router.post('/',GradoController.newGrado);
router.get('/:id',GradoController.getOneById);
router.patch('/',GradoController.editGrado);

export default router;
