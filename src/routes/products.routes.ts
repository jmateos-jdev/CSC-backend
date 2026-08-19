import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';
import productsController from '../controllers/products/index.js';

const router = Router();

router.get('/', validateAuth, productsController.getAllProducts);
router.get('/by-categories', validateAuth, productsController.getProductsByCategories);
router.get('/detail', validateAuth, productsController.getProduct);
router.get('/operations', validateAuth, productsController.getProductOperations);
router.post('/create', validateAuth, productsController.createProduct);
router.put('/update', validateAuth, productsController.updateProduct);
router.delete('/delete', validateAuth, productsController.deleteProduct);

export default router;
