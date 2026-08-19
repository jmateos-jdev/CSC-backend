import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import suppliersService from '../../services/suppliers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const createSupplier = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.id) {
        throw new AppError('No tienes una cuenta', 401);
    }

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { name } = req.body;

    if (!name) {
        throw new AppError('El nombre del proveedor es requerido', 400);
    }

    const newSupplier = await suppliersService.createSupplier(
        req.currentUser.main_company_id,
        req.currentUser.id,
        name
    );

    if (!newSupplier) {
        throw new AppError('No se pudo crear el proveedor', 400);
    }

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Proveedor creado correctamente',
        supplier: newSupplier,
    });
});
