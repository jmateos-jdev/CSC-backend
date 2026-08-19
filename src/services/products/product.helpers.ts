import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const productSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    initial_stock: true,
    barcode: true,
    created_at: true,
    units_of_measure: {
        select: {
            id: true,
            name: true,
            abbreviation: true,
        },
    },
    product_categories: {
        select: {
            categories: {
                select: {
                    id: true,
                    name: true,
                    parent_category_id: true,
                },
            },
        },
    },
} as const;

export const formatProduct = (product: {
    id: number;
    name: string;
    description: string | null;
    price: unknown;
    initial_stock: number | null;
    barcode: string | null;
    created_at: Date | null;
    units_of_measure: { id: number; name: string; abbreviation: string };
    product_categories: { categories: { id: number; name: string; parent_category_id: number | null } }[];
}) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price != null ? Number(product.price) : null,
    initial_stock: product.initial_stock,
    barcode: product.barcode,
    created_at: product.created_at,
    unit_of_measure: product.units_of_measure,
    categories: product.product_categories.map((pc) => pc.categories),
});

export const normalizeCategoryIds = (category_ids: number[] = []) => {
    return [...new Set(category_ids.map(Number))].filter((id) => !Number.isNaN(id) && id > 0);
};

export const validateUnitOfMeasure = async (unit_of_measure_id: number) => {
    const unit = await prisma.units_of_measure.findFirst({
        where: { id: unit_of_measure_id },
    });

    if (!unit) {
        throw new AppError('La unidad de medida no existe', 400);
    }
};

export const validateCategories = async (company_id: number, category_ids: number[]) => {
    if (category_ids.length === 0) {
        return;
    }

    const categories = await prisma.categories.findMany({
        where: {
            id: { in: category_ids },
            company_id,
        },
        select: { id: true },
    });

    if (categories.length !== category_ids.length) {
        throw new AppError('Una o más categorías no existen', 400);
    }
};
