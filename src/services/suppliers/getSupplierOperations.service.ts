import prisma from '../../lib/prisma.js';

export const getSupplierOperations = async (id: number, company_id: number) => {
    const supplier = await prisma.suppliers.findFirst({
        where: {
            id,
            company_id,
        },
        select: { id: true },
    });

    if (!supplier) {
        return null;
    }

    const purchases = await prisma.purchases.findMany({
        where: {
            supplier_id: id,
            company_id,
        },
        select: {
            id: true,
            purchase_number: true,
            created_at: true,
            purchase_details: {
                select: {
                    id: true,
                    quantity: true,
                    unit_price: true,
                    discount: true,
                    products: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    const operations = purchases
        .map((purchase) => ({
            type: 'purchase' as const,
            id: purchase.id,
            purchase_number: purchase.purchase_number,
            created_at: purchase.created_at,
            details: purchase.purchase_details.map((detail) => ({
                id: detail.id,
                quantity: detail.quantity,
                unit_price: Number(detail.unit_price),
                discount: Number(detail.discount),
                product: detail.products,
            })),
        }))
        .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

    return operations;
};
