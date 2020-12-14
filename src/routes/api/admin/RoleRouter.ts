import { Router } from "express";
import RoleController from "../../../controllers/RoleController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', RoleController.store);
router.get('/', RoleController.fetch);
router.get('/list', RoleController.list);
router.get('/:id', RoleController.show);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.destroy);

export default router;
