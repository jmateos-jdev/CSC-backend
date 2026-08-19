import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import productsService from '../../services/products/index.js';
import { AppError } from '../../utils/appError.util.js';

export const createProduct = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.id) {
        throw new AppError('No tienes una cuenta', 401);
    }

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { name, description, price, initial_stock, unit_of_measure_id, barcode, category_ids } = req.body;

    if (!name) {
        throw new AppError('El nombre del producto es requerido', 400);
    }

    if (!unit_of_measure_id) {
        throw new AppError('La unidad de medida es requerida', 400);
    }

    if (category_ids !== undefined && !Array.isArray(category_ids)) {
        throw new AppError('Las categorías deben enviarse como un listado', 400);
    }

    const newProduct = await productsService.createProduct(
        req.currentUser.main_company_id,
        req.currentUser.id,
        {
            name,
            description: description || null,
            price: price ?? null,
            initial_stock: initial_stock ?? 0,
            unit_of_measure_id: Number(unit_of_measure_id),
            barcode: barcode || null,
            category_ids: category_ids || [],
        }
    );

    if (!newProduct) {
        throw new AppError('No se pudo crear el producto', 400);
    }

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Producto creado correctamente',
        product: newProduct,
    });
});
