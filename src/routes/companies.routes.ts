import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';
import companiesController from '../controllers/companies/index.js';

const router = Router();

router.post('/create', validateAuth, companiesController.createCompany);
router.get('/', validateAuth, companiesController.getMyCompany);
router.put('/update', validateAuth, companiesController.updateCompany);

export default router;