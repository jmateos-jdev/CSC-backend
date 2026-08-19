import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const deleteSupplier = async (id: number, company_id: number) => {
    const supplier = await prisma.suppliers.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!supplier) {
        return null;
    }

    const purchasesCount = await prisma.purchases.count({
        where: {
            supplier_id: id,
        },
    });

    if (purchasesCount > 0) {
        throw new AppError('No se puede eliminar el proveedor porque tiene operaciones asociadas', 400);
    }

    await prisma.suppliers.delete({
        where: { id },
    });

    return true;
};
