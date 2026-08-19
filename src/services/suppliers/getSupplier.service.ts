import prisma from '../../lib/prisma.js';

export const getSupplier = async (id: number, company_id: number) => {
    const supplier = await prisma.suppliers.findFirst({
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

    if (!supplier) {
        return null;
    }

    return {
        id: supplier.id,
        name: supplier.name,
        created_at: supplier.created_at,
        created_by: supplier.users,
    };
};
