import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const updateCategory = async (
    id: number,
    company_id: number,
    name: string,
    parent_category_id: number | null | undefined
) => {
    const category = await prisma.categories.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!category) {
        return null;
    }

    if (parent_category_id) {
        if (parent_category_id === id) {
            throw new AppError('Una categoría no puede ser padre de sí misma', 400);
        }

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

    const updatedCategory = await prisma.categories.update({
        where: { id },
        data: {
            name,
            ...(parent_category_id !== undefined && { parent_category_id: parent_category_id || null }),
        },
        select: {
            id: true,
            name: true,
            parent_category_id: true,
        },
    });

    return updatedCategory;
};
