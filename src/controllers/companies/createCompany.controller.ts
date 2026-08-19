import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import companiesService from '../../services/companies/index.js';
import { AppError } from '../../utils/appError.util.js';

export const createCompany = catchAsync(async (req: Request, res: Response) => {

    if (!req.currentUser?.id) {
        throw new AppError('No tienes una cuenta', 401);
    }

    const { name, logo } = req.body;

    if (!name) {
        throw new AppError('El nombre de la empresa es requerido', 400);
    }

    const newCompany = await companiesService.createCompany(name, logo, req.currentUser.id);

    if (!newCompany) {
        throw new AppError('No se pudo crear la empresa', 400);
    }

    res.status(201).json({ 
        status: 'success', 
        statusCode: 201, 
        message: 'Empresa creada correctamente', 
        company: newCompany });
    
});