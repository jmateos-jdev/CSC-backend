import prisma from '../../lib/prisma.js';

export const updateSupplier = async (id: number, company_id: number, name: string) => {
    const supplier = await prisma.suppliers.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!supplier) {
        return null;
    }

    const updatedSupplier = await prisma.suppliers.update({
        where: { id },
        data: { name },
        select: {
            id: true,
            name: true,
            created_at: true,
        },
    });

    return updatedSupplier;
};
