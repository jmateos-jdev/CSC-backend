import prisma from '../../lib/prisma.js';
import { formatProduct, normalizeCategoryIds, productSelect } from './product.helpers.js';

export const getProductsByCategories = async (company_id: number, category_ids: number[]) => {
    const normalizedCategoryIds = normalizeCategoryIds(category_ids);

    const products = await prisma.products.findMany({
        where: {
            company_id,
            product_categories: {
                some: {
                    category_id: {
                        in: normalizedCategoryIds,
                    },
                },
            },
        },
        select: productSelect,
        orderBy: {
            name: 'asc',
        },
    });

    return products.map(formatProduct);
};
