import { Router } from "express";
import ModuleController from "../../../controllers/ModuleController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', ModuleController.store);
router.get('/', ModuleController.fetch);
router.get('/list', ModuleController.list);
router.get('/:id', ModuleController.show);
router.put('/:id', ModuleController.update);
router.delete('/:id', ModuleController.destroy);

export default router;
