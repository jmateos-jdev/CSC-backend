import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import productsService from '../../services/products/index.js';
import { AppError } from '../../utils/appError.util.js';

export const updateProduct = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.id) {
        throw new AppError('No tienes una cuenta', 401);
    }

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { id, name, description, price, initial_stock, unit_of_measure_id, barcode, category_ids } = req.body;

    if (!id) {
        throw new AppError('El id del producto es requerido', 400);
    }

    if (!name) {
        throw new AppError('El nombre del producto es requerido', 400);
    }

    if (category_ids !== undefined && !Array.isArray(category_ids)) {
        throw new AppError('Las categorías deben enviarse como un listado', 400);
    }

    const updatedProduct = await productsService.updateProduct(
        Number(id),
        req.currentUser.main_company_id,
        req.currentUser.id,
        {
            name,
            description,
            price,
            initial_stock,
            unit_of_measure_id: unit_of_measure_id ? Number(unit_of_measure_id) : undefined,
            barcode,
            category_ids,
        }
    );

    if (!updatedProduct) {
        throw new AppError('No se encontró el producto', 400);
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Producto actualizado correctamente',
        product: updatedProduct,
    });
});
