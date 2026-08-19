import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import customersService from '../../services/customers/index.js';
import { AppError } from '../../utils/appError.util.js';

export const unifyCustomers = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.main_company_id) {
        throw new AppError('No tienes una empresa principal asignada', 400);
    }

    const { source_id, destination_id } = req.body;

    if (!source_id) {
        throw new AppError('El id del cliente a eliminar es requerido', 400);
    }

    if (!destination_id) {
        throw new AppError('El id del cliente destino es requerido', 400);
    }

    const unifiedCustomer = await customersService.unifyCustomers(
        Number(source_id),
        Number(destination_id),
        req.currentUser.main_company_id
    );

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Clientes unificados correctamente',
        customer: unifiedCustomer,
    });
});
