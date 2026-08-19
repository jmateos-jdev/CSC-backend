import prisma from '../../lib/prisma.js';
import { formatProduct, productSelect } from './product.helpers.js';

export const getProduct = async (id: number, company_id: number) => {
    const product = await prisma.products.findFirst({
        where: {
            id,
            company_id,
        },
        select: {
            ...productSelect,
            company_id: true,
            created_by: true,
            users: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    if (!product) {
        return null;
    }

    return {
        ...formatProduct(product),
        company_id: product.company_id,
        created_by: product.users,
    };
};
