import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const deleteCustomer = async (id: number, company_id: number) => {
    const customer = await prisma.customers.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!customer) {
        return null;
    }

    const salesCount = await prisma.sales.count({
        where: {
            customer_id: id,
        },
    });

    if (salesCount > 0) {
        throw new AppError('No se puede eliminar el cliente porque tiene operaciones asociadas', 400);
    }

    await prisma.customers.delete({
        where: { id },
    });

    return true;
};
