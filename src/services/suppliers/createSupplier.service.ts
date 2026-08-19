import prisma from '../../lib/prisma.js';

export const createSupplier = async (company_id: number, user_id: number, name: string) => {
    const newSupplier = await prisma.suppliers.create({
        select: {
            id: true,
            name: true,
            created_at: true,
        },
        data: {
            name,
            company_id,
            created_by: user_id,
        },
    });

    return newSupplier;
};
