import prisma from '../../lib/prisma.js';

export const getAllCustomers = async (company_id: number) => {
    const customers = await prisma.customers.findMany({
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

    return customers;
};
