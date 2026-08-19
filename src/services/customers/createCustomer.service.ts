import prisma from '../../lib/prisma.js';

export const createCustomer = async (company_id: number, user_id: number, name: string) => {
    const newCustomer = await prisma.customers.create({
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

    return newCustomer;
};
