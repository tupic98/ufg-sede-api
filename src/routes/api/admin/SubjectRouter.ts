import { Router } from "express";
import SubjectController from "../../../controllers/SubjectController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', SubjectController.store);
router.get('/', SubjectController.fetch);
router.get('/:id', SubjectController.show);
router.put('/:id', SubjectController.update);
router.delete('/:id', SubjectController.destroy);

export default router;
