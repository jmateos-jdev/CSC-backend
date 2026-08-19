import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';
import categoriesController from '../controllers/categories/index.js';

const router = Router();

router.get('/', validateAuth, categoriesController.getAllCategories);
router.post('/create', validateAuth, categoriesController.createCategory);
router.put('/update', validateAuth, categoriesController.updateCategory);
router.delete('/delete', validateAuth, categoriesController.deleteCategory);

export default router;
