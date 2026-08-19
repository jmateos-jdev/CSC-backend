import prisma from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.util.js';

export const deleteProduct = async (id: number, company_id: number) => {
    const product = await prisma.products.findFirst({
        where: {
            id,
            company_id,
        },
    });

    if (!product) {
        return null;
    }

    const [salesCount, purchasesCount, inventoriesCount, adjustmentsCount] = await Promise.all([
        prisma.sale_details.count({ where: { product_id: id } }),
        prisma.purchase_details.count({ where: { product_id: id } }),
        prisma.inventory_details.count({ where: { product_id: id } }),
        prisma.stock_adjustments.count({ where: { product_id: id } }),
    ]);

    if (salesCount + purchasesCount + inventoriesCount + adjustmentsCount > 0) {
        throw new AppError('No se puede eliminar el producto porque tiene operaciones asociadas', 400);
    }

    await prisma.products.delete({
        where: { id },
    });

    return true;
};
