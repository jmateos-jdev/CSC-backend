import prisma from '../../lib/prisma.js';

export const updateCustomer = async (id: number, company_id: number, name: string) => {
    const customer = await prisma.customers.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!customer) {
        return null;
    }

    const updatedCustomer = await prisma.customers.update({
        where: { id },
        data: { name },
        select: {
            id: true,
            name: true,
            created_at: true,
        },
    });

    return updatedCustomer;
};
