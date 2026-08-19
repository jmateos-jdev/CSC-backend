import prisma from '../../lib/prisma.js';
import {
    formatProduct,
    normalizeCategoryIds,
    productSelect,
    validateCategories,
    validateUnitOfMeasure,
} from './product.helpers.js';

type UpdateProductData = {
    name: string;
    description?: string | null | undefined;
    price?: number | null | undefined;
    initial_stock?: number | null | undefined;
    unit_of_measure_id?: number | undefined;
    barcode?: string | null | undefined;
    category_ids?: number[] | undefined;
};

export const updateProduct = async (
    id: number,
    company_id: number,
    user_id: number,
    data: UpdateProductData
) => {
    const product = await prisma.products.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!product) {
        return null;
    }

    if (data.unit_of_measure_id) {
        await validateUnitOfMeasure(data.unit_of_measure_id);
    }

    const category_ids = data.category_ids !== undefined ? normalizeCategoryIds(data.category_ids) : undefined;

    if (category_ids) {
        await validateCategories(company_id, category_ids);
    }

    const updatedProduct = await prisma.products.update({
        where: { id },
        data: {
            name: data.name,
            ...(data.description !== undefined && { description: data.description || null }),
            ...(data.price !== undefined && { price: data.price ?? null }),
            ...(data.initial_stock !== undefined && { initial_stock: data.initial_stock ?? 0 }),
            ...(data.unit_of_measure_id && { unit_of_measure_id: data.unit_of_measure_id }),
            ...(data.barcode !== undefined && { barcode: data.barcode || null }),
            ...(category_ids !== undefined && {
                product_categories: {
                    deleteMany: {},
                    create: category_ids.map((category_id) => ({
                        category_id,
                        created_by: user_id,
                    })),
                },
            }),
        },
        select: productSelect,
    });

    return formatProduct(updatedProduct);
};
