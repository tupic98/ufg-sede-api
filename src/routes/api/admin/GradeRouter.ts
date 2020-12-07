import { Router } from "express";
import GradeController from "../../../controllers/GradeController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', GradeController.store);
router.get('/', GradeController.fetch);
router.get('/:id', GradeController.show);
router.put('/:id', GradeController.update);
router.delete('/:id', GradeController.destroy);

export default router;
