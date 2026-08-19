import { getAllCustomers } from './getAllCustomers.service.js';
import { getCustomer } from './getCustomer.service.js';
import { getCustomerOperations } from './getCustomerOperations.service.js';
import { createCustomer } from './createCustomer.service.js';
import { updateCustomer } from './updateCustomer.service.js';
import { deleteCustomer } from './deleteCustomer.service.js';
import { unifyCustomers } from './unifyCustomers.service.js';

export default {
    getAllCustomers,
    getCustomer,
    getCustomerOperations,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    unifyCustomers,
};
