import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import productsService from '../../services/products/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getProductOperations = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { id } = req.query;

    if (!id) {
        throw new AppError('El id del producto es requerido', 400);
    }

    const operations = await productsService.getProductOperations(Number(id), req.currentUser.main_company_id);

    if (!operations) {
        throw new AppError('No se encontró el producto', 400);
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Operaciones del producto obtenidas correctamente',
        operations,
    });
});
