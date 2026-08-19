import prisma from '../../lib/prisma.js';

export const getCustomer = async (id: number, company_id: number) => {
    const customer = await prisma.customers.findFirst({
        where: {
            id,
            company_id,
        },
        select: {
            id: true,
            name: true,
            created_at: true,
            users: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    if (!customer) {
        return null;
    }

    return {
        id: customer.id,
        name: customer.name,
        created_at: customer.created_at,
        created_by: customer.users,
    };
};
