import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const unifySuppliers = async (source_id: number, destination_id: number, company_id: number) => {
    if (source_id === destination_id) {
        throw new AppError('El proveedor a eliminar y el proveedor destino deben ser distintos', 400);
    }

    const [sourceSupplier, destinationSupplier] = await Promise.all([
        prisma.suppliers.findFirst({
            where: {
                id: source_id,
                company_id,
            },
        }),
        prisma.suppliers.findFirst({
            where: {
                id: destination_id,
                company_id,
            },
        }),
    ]);

    if (!sourceSupplier) {
        throw new AppError('No se encontró el proveedor a eliminar', 400);
    }

    if (!destinationSupplier) {
        throw new AppError('No se encontró el proveedor destino', 400);
    }

    const unifiedSupplier = await prisma.$transaction(async (tx) => {
        await tx.purchases.updateMany({
            where: {
                supplier_id: source_id,
                company_id,
            },
            data: {
                supplier_id: destination_id,
            },
        });

        await tx.suppliers.delete({
            where: { id: source_id },
        });

        return tx.suppliers.findFirst({
            where: { id: destination_id },
            select: {
                id: true,
                name: true,
                created_at: true,
            },
        });
    });

    return unifiedSupplier;
};
