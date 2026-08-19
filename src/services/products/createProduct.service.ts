import prisma from '../../lib/prisma.js';
import {
    formatProduct,
    normalizeCategoryIds,
    productSelect,
    validateCategories,
    validateUnitOfMeasure,
} from './product.helpers.js';

type CreateProductData = {
    name: string;
    description: string | null;
    price: number | null;
    initial_stock: number | null;
    unit_of_measure_id: number;
    barcode: string | null;
    category_ids: number[];
};

export const createProduct = async (company_id: number, user_id: number, data: CreateProductData) => {
    const category_ids = normalizeCategoryIds(data.category_ids);

    await validateUnitOfMeasure(data.unit_of_measure_id);
    await validateCategories(company_id, category_ids);

    const newProduct = await prisma.products.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            initial_stock: data.initial_stock,
            unit_of_measure_id: data.unit_of_measure_id,
            barcode: data.barcode,
            company_id,
            created_by: user_id,
            product_categories: {
                create: category_ids.map((category_id) => ({
                    category_id,
                    created_by: user_id,
                })),
            },
        },
        select: productSelect,
    });

    return formatProduct(newProduct);
};
