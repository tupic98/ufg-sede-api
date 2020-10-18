import { Router } from 'express';

import MateriaController from './../../controllers/MateriaController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', MateriaController.listAll);
router.post('/',MateriaController.newMateria);
router.get('/:id',MateriaController.getOneById);
router.patch('/:id',MateriaController.editMateria);

export default router;
