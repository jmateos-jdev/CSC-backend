import { Router } from 'express';
import { validateAuth } from '../middlewares/auth.middleaware.js';
import customersController from '../controllers/customers/index.js';

const router = Router();

router.get('/', validateAuth, customersController.getAllCustomers);
router.get('/detail', validateAuth, customersController.getCustomer);
router.get('/operations', validateAuth, customersController.getCustomerOperations);
router.post('/create', validateAuth, customersController.createCustomer);
router.put('/update', validateAuth, customersController.updateCustomer);
router.put('/unify', validateAuth, customersController.unifyCustomers);
router.delete('/delete', validateAuth, customersController.deleteCustomer);

export default router;
