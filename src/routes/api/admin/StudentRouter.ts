import { Router } from "express";
import StudentController from "../../../controllers/StudentController";

const router: Router = Router();

//TODO: implement role and permission middleware
router.post('/', StudentController.store);
router.get('/', StudentController.fetch);
router.get('/:id', StudentController.show);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.destroy);

export default router;
