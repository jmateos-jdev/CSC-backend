import { Router } from 'express';
import testRoutes from './test.routes.js';

const router = Router();

router.use('/test', testRoutes);

export default router;