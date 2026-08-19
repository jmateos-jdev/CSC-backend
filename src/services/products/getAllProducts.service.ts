import prisma from '../../lib/prisma.js';
import { formatProduct, productSelect } from './product.helpers.js';

export const getAllProducts = async (company_id: number) => {
    const products = await prisma.products.findMany({
        where: {
            company_id,
        },
        select: productSelect,
        orderBy: {
            name: 'asc',
        },
    });

    return products.map(formatProduct);
};
