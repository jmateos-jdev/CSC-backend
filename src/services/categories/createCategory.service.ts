import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const createCategory = async (company_id: number, name: string, parent_category_id: number | null) => {
    if (parent_category_id) {
        const parentCategory = await prisma.categories.findFirst({
            where: {
                id: parent_category_id,
                company_id,
            },
        });

        if (!parentCategory) {
            throw new AppError('La categoría padre no existe', 400);
        }
    }

    const newCategory = await prisma.categories.create({
        select: {
            id: true,
            name: true,
            parent_category_id: true,
        },
        data: {
            name,
            company_id,
            parent_category_id: parent_category_id || null,
        },
    });

    return newCategory;
};
