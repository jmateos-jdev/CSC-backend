import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import suppliersService from '../../services/suppliers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getSupplierOperations = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { id } = req.query;

    if (!id) {
        throw new AppError('El id del proveedor es requerido', 400);
    }

    const operations = await suppliersService.getSupplierOperations(Number(id), req.currentUser.main_company_id);

    if (!operations) {
        throw new AppError('No se encontró el proveedor', 400);
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Operaciones del proveedor obtenidas correctamente',
        operations,
    });
});
