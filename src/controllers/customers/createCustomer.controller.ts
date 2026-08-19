import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import customersService from '../../services/customers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const createCustomer = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.id) {
        throw new AppError('No tienes una cuenta', 401);
    }

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { name } = req.body;

    if (!name) {
        throw new AppError('El nombre del cliente es requerido', 400);
    }

    const newCustomer = await customersService.createCustomer(
        req.currentUser.main_company_id,
        req.currentUser.id,
        name
    );

    if (!newCustomer) {
        throw new AppError('No se pudo crear el cliente', 400);
    }

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Cliente creado correctamente',
        customer: newCustomer,
    });
});
