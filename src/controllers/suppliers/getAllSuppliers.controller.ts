import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import suppliersService from '../../services/suppliers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getAllSuppliers = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const suppliers = await suppliersService.getAllSuppliers(req.currentUser.main_company_id);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Proveedores obtenidos correctamente',
        suppliers,
    });
});
