import { Router } from "express";
import SectionController from "../../../controllers/SectionController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', SectionController.store);
router.get('/', SectionController.fetch);
router.get('/list', SectionController.list);
router.get('/:id', SectionController.show);
router.put('/:id', SectionController.update);
router.delete('/:id', SectionController.destroy);

export default router;
