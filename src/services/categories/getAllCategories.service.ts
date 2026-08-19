import prisma from '../../lib/prisma.js';

export const getAllCategories = async (company_id: number) => {
    const categories = await prisma.categories.findMany({
        where: {
            company_id,
        },
        select: {
            id: true,
            name: true,
            parent_category_id: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return categories;
};
