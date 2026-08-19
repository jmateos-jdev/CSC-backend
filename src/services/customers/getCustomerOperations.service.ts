import prisma from '../../lib/prisma.js';

export const getCustomerOperations = async (id: number, company_id: number) => {
    const customer = await prisma.customers.findFirst({
        where: {
            id,
            company_id,
        },
        select: { id: true },
    });

    if (!customer) {
        return null;
    }

    const [sales, customerReturns] = await Promise.all([
        prisma.sales.findMany({
            where: {
                customer_id: id,
                company_id,
            },
            select: {
                id: true,
                sale_number: true,
                created_at: true,
                sale_details: {
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
        }),
        prisma.returns.findMany({
            where: {
                company_id,
                sale_details: {
                    sales: {
                        customer_id: id,
                    },
                },
            },
            select: {
                id: true,
                return_number: true,
                quantity: true,
                created_at: true,
                sale_detail_id: true,
                sale_details: {
                    select: {
                        sale_id: true,
                        products: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    const operations = [
        ...sales.map((sale) => ({
            type: 'sale' as const,
            id: sale.id,
            sale_number: sale.sale_number,
            created_at: sale.created_at,
            details: sale.sale_details.map((detail) => ({
                id: detail.id,
                quantity: detail.quantity,
                unit_price: Number(detail.unit_price),
                discount: Number(detail.discount),
                product: detail.products,
            })),
        })),
        ...customerReturns.map((customerReturn) => ({
            type: 'return' as const,
            id: customerReturn.id,
            return_number: customerReturn.return_number,
            quantity: customerReturn.quantity,
            created_at: customerReturn.created_at,
            sale_id: customerReturn.sale_details.sale_id,
            sale_detail_id: customerReturn.sale_detail_id,
            product: customerReturn.sale_details.products,
        })),
    ].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    return operations;
};
