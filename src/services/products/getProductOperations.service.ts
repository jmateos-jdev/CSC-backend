import prisma from '../../lib/prisma.js';

export const getProductOperations = async (id: number, company_id: number) => {
    const product = await prisma.products.findFirst({
        where: {
            id,
            company_id,
        },
        select: { id: true },
    });

    if (!product) {
        return null;
    }

    const [saleDetails, purchaseDetails, inventoryDetails, stockAdjustments, productReturns] = await Promise.all([
        prisma.sale_details.findMany({
            where: { product_id: id },
            select: {
                id: true,
                quantity: true,
                unit_price: true,
                discount: true,
                created_at: true,
                sale_id: true,
                sales: {
                    select: {
                        sale_number: true,
                        customers: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.purchase_details.findMany({
            where: { product_id: id },
            select: {
                id: true,
                quantity: true,
                unit_price: true,
                discount: true,
                created_at: true,
                purchase_id: true,
                purchases: {
                    select: {
                        purchase_number: true,
                        suppliers: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.inventory_details.findMany({
            where: { product_id: id },
            select: {
                id: true,
                quantity: true,
                created_at: true,
                inventory_id: true,
                inventories: {
                    select: {
                        inventory_number: true,
                    },
                },
            },
        }),
        prisma.stock_adjustments.findMany({
            where: { product_id: id },
            select: {
                id: true,
                quantity: true,
                reason: true,
                created_at: true,
            },
        }),
        prisma.returns.findMany({
            where: {
                sale_details: {
                    product_id: id,
                },
            },
            select: {
                id: true,
                return_number: true,
                quantity: true,
                created_at: true,
                sale_detail_id: true,
            },
        }),
    ]);

    const operations = [
        ...saleDetails.map((detail) => ({
            type: 'sale' as const,
            id: detail.id,
            quantity: detail.quantity,
            unit_price: Number(detail.unit_price),
            discount: Number(detail.discount),
            created_at: detail.created_at,
            sale_id: detail.sale_id,
            sale_number: detail.sales.sale_number,
            customer: detail.sales.customers,
        })),
        ...purchaseDetails.map((detail) => ({
            type: 'purchase' as const,
            id: detail.id,
            quantity: detail.quantity,
            unit_price: Number(detail.unit_price),
            discount: Number(detail.discount),
            created_at: detail.created_at,
            purchase_id: detail.purchase_id,
            purchase_number: detail.purchases.purchase_number,
            supplier: detail.purchases.suppliers,
        })),
        ...inventoryDetails.map((detail) => ({
            type: 'inventory' as const,
            id: detail.id,
            quantity: detail.quantity,
            created_at: detail.created_at,
            inventory_id: detail.inventory_id,
            inventory_number: detail.inventories.inventory_number,
        })),
        ...stockAdjustments.map((adjustment) => ({
            type: 'stock_adjustment' as const,
            id: adjustment.id,
            quantity: adjustment.quantity,
            reason: adjustment.reason,
            created_at: adjustment.created_at,
        })),
        ...productReturns.map((productReturn) => ({
            type: 'return' as const,
            id: productReturn.id,
            quantity: productReturn.quantity,
            created_at: productReturn.created_at,
            return_number: productReturn.return_number,
            sale_detail_id: productReturn.sale_detail_id,
        })),
    ].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    return operations;
};
