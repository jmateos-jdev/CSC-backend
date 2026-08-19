import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import categoriesService from '../../services/categories/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const categories = await categoriesService.getAllCategories(req.currentUser.main_company_id);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Categorías obtenidas correctamente',
        categories,
    });
});
