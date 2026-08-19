import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import productsService from '../../services/products/index.js';
import { AppError } from '../../utils/appError.util.js';

const parseCategoryIds = (value: unknown) => {
    if (Array.isArray(value)) {
        return value.map(Number);
    }

    if (typeof value === 'string') {
        return value.split(',').map((item) => Number(item.trim()));
    }

    if (typeof value === 'number') {
        return [value];
    }

    return [];
};

export const getProductsByCategories = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const category_ids = parseCategoryIds(req.query.category_ids);

    if (category_ids.length === 0) {
        throw new AppError('Debes enviar al menos una categoría', 400);
    }

    const products = await productsService.getProductsByCategories(
        req.currentUser.main_company_id,
        category_ids
    );

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Productos obtenidos correctamente',
        products,
    });
});
