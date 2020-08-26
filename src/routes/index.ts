import * as express from 'express';
import { Router, Response, Request } from 'express';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Connected!',
  });
});

export default router;
