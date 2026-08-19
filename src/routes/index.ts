import { Router } from 'express';
import testRoutes from './test.routes.js';
import companiesRoutes from './companies.routes.js';

const router = Router();

router.use('/test', testRoutes);
router.use('/companies', companiesRoutes);

export default router;