import { Router, type Request, type Response } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
});

router.get('/protected', validateAuth, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World', user: req.currentUser });
});

export default router;
