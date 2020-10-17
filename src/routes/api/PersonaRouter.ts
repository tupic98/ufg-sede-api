import { Router } from 'express';

import PersonaController from './../../controllers/PersonaController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', PersonaController.listAll);
router.post('/',PersonaController.newPersona);
router.get('/:id',PersonaController.getOneById);

export default router;
