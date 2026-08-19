import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import categoriesService from '../../services/categories/index.js';
import { AppError } from '../../utils/appError.util.js';

export const createCategory = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { name, parent_category_id } = req.body;

    if (!name) {
        throw new AppError('El nombre de la categoría es requerido', 400);
    }

    const newCategory = await categoriesService.createCategory(
        req.currentUser.main_company_id,
        name,
        parent_category_id || null
    );

    if (!newCategory) {
        throw new AppError('No se pudo crear la categoría', 400);
    }

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Categoría creada correctamente',
        category: newCategory,
    });
});
