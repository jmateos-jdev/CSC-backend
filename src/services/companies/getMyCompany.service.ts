import prisma from '../../lib/prisma.js';

export const getMyCompany = async (main_company_id: number) => {
    const company = await prisma.companies.findFirst({
        where: {
            id: main_company_id,
        },
    });
    return company;
};