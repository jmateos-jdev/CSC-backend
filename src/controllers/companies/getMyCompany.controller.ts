import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.util.js';
import companiesService from '../../services/companies/index.js';
import { AppError } from '../../utils/appError.util.js';

export const getMyCompany = catchAsync(async (req: Request, res: Response) => {
    
    if (!req.currentUser?.main_company_id) {
        return res.status(400).json({ status: 'error', statusCode: 400, message: 'No tienes una empresa principal asignada' });
    }

    const company = await companiesService.getMyCompany(req.currentUser?.main_company_id);

    if (!company) {
        throw new AppError('No se encontró la empresa principal', 400);
    }

    res.status(200).json({ status: 'success', statusCode: 200, message: 'Empresa principal obtenida correctamente', company });
});