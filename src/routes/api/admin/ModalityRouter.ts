import { Router } from "express";
import ModalityController from "../../../controllers/ModalityController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', ModalityController.store);
router.get('/', ModalityController.fetch);
router.get('/:id', ModalityController.show);
router.put('/:id', ModalityController.update);
router.delete('/:id', ModalityController.destroy);

export default router;
