import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import productsService from '../../services/products/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const products = await productsService.getAllProducts(req.currentUser.main_company_id);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Productos obtenidos correctamente',
        products,
    });
});
