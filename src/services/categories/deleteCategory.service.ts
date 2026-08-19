import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const deleteCategory = async (id: number, company_id: number) => {
    const category = await prisma.categories.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!category) {
        return null;
    }

    const productsCount = await prisma.product_categories.count({
        where: {
            category_id: id,
        },
    });

    if (productsCount > 0) {
        throw new AppError('No se puede eliminar la categoría porque tiene productos asociados', 400);
    }

    await prisma.categories.delete({
        where: { id },
    });

    return true;
};
