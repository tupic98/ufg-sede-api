import { Router } from "express";
import StudentController from "../../../controllers/StudentController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', StudentController.store);
router.get('/', StudentController.fetch);
router.get('/:id', StudentController.show);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.destroy);
router.get('/:id/notes', StudentController.fetchNotes);
router.post('/:id/notes', StudentController.saveNotes);
router.post('/:id/institutional-average', StudentController.publishInstitutionalAverage);
router.post('/:id/final-average', StudentController.publishFinalAverage);
router.post('/:id/add-subject', StudentController.assignNewSubject);
router.get('/:id/subjects', StudentController.subjects);

export default router;
