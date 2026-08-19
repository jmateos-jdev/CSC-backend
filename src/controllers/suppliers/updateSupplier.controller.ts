import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import suppliersService from '../../services/suppliers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const updateSupplier = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { id, name } = req.body;

    if (!id) {
        throw new AppError('El id del proveedor es requerido', 400);
    }

    if (!name) {
        throw new AppError('El nombre del proveedor es requerido', 400);
    }

    const updatedSupplier = await suppliersService.updateSupplier(
        Number(id),
        req.currentUser.main_company_id,
        name
    );

    if (!updatedSupplier) {
        throw new AppError('No se encontró el proveedor', 400);
    }

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Proveedor actualizado correctamente',
        supplier: updatedSupplier,
    });
});
