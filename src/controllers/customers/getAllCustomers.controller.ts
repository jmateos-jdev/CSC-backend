import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import customersService from '../../services/customers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getAllCustomers = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const customers = await customersService.getAllCustomers(req.currentUser.main_company_id);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Clientes obtenidos correctamente',
        customers,
    });
});
