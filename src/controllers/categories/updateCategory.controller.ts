import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import categoriesService from '../../services/categories/index.js';
import { AppError } from '../../utils/appError.util.js';

export const updateCategory = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { id, name, parent_category_id } = req.body;

    if (!id) {
        throw new AppError('El id de la categoría es requerido', 400);
    }

    if (!name) {
        throw new AppError('El nombre de la categoría es requerido', 400);
    }

    const updatedCategory = await categoriesService.updateCategory(
        Number(id),
        req.currentUser.main_company_id,
        name,
        parent_category_id
    );

    if (!updatedCategory) {
        throw new AppError('No se encontró la categoría', 400);
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Categoría actualizada correctamente',
        category: updatedCategory,
    });
});
