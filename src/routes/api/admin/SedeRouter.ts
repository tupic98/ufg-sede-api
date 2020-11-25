import { Router } from "express";
import SedeController from "../../../controllers/SedeController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', SedeController.store);
router.get('/', SedeController.fetch);
router.get('/:id', SedeController.show);
router.put('/:id', SedeController.update);
router.delete('/:id', SedeController.destroy);

export default router;
