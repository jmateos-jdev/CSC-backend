import { Router } from 'express';
import testRoutes from './test.routes.js';
import companiesRoutes from './companies.routes.js';
import categoriesRoutes from './categories.routes.js';

const router = Router();

router.use('/test', testRoutes);
router.use('/companies', companiesRoutes);
router.use('/categories', categoriesRoutes);

export default router;