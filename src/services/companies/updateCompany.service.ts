import prisma from '../../lib/prisma.js';

export const updateCompany = async (main_company_id: number, name: string, logo: string | null) => {
    
    const updatedCompany = await prisma.companies.update({
        where: { id: main_company_id },
        data: { name, logo: logo || null },
        select: {
            id: true,
            name: true,
            logo: true,
        },
    });

    return updatedCompany;
};