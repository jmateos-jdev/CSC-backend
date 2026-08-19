import prisma from '../../lib/prisma.js';

export const getAllSuppliers = async (company_id: number) => {
    const suppliers = await prisma.suppliers.findMany({
        where: {
            company_id,
        },
        select: {
            id: true,
            name: true,
            created_at: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return suppliers;
};
