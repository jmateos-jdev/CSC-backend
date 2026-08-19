import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const unifyCustomers = async (source_id: number, destination_id: number, company_id: number) => {
    if (source_id === destination_id) {
        throw new AppError('El cliente a eliminar y el cliente destino deben ser distintos', 400);
    }

    const [sourceCustomer, destinationCustomer] = await Promise.all([
        prisma.customers.findFirst({
            where: {
                id: source_id,
                company_id,
            },
        }),
        prisma.customers.findFirst({
            where: {
                id: destination_id,
                company_id,
            },
        }),
    ]);

    if (!sourceCustomer) {
        throw new AppError('No se encontró el cliente a eliminar', 400);
    }

    if (!destinationCustomer) {
        throw new AppError('No se encontró el cliente destino', 400);
    }

    const unifiedCustomer = await prisma.$transaction(async (tx) => {
        await tx.sales.updateMany({
            where: {
                customer_id: source_id,
                company_id,
            },
            data: {
                customer_id: destination_id,
            },
        });

        await tx.customers.delete({
            where: { id: source_id },
        });

        return tx.customers.findFirst({
            where: { id: destination_id },
            select: {
                id: true,
                name: true,
                created_at: true,
            },
        });
    });

    return unifiedCustomer;
};
