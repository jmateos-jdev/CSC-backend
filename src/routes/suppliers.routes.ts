import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';
import suppliersController from '../controllers/suppliers/index.js';

const router = Router();

router.get('/', validateAuth, suppliersController.getAllSuppliers);
router.get('/detail', validateAuth, suppliersController.getSupplier);
router.get('/operations', validateAuth, suppliersController.getSupplierOperations);
router.post('/create', validateAuth, suppliersController.createSupplier);
router.put('/update', validateAuth, suppliersController.updateSupplier);
router.put('/unify', validateAuth, suppliersController.unifySuppliers);
router.delete('/delete', validateAuth, suppliersController.deleteSupplier);

export default router;
