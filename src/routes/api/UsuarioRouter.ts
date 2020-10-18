import { Router } from 'express';

import UsuarioController from '../../controllers/UsuarioController';
//import { checkJWT } from './../../middlewares/checkJWT';

const router: Router = Router();

//Faltan los metodos de validacion de token aun no implementados
router.get('/', UsuarioController.listAll);
router.post('/',UsuarioController.newUsuario);
router.get('/:id',UsuarioController.getOneById);
router.delete('/:id',UsuarioController.deleteById);

export default router;
