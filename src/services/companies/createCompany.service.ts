import prisma from '../../lib/prisma.js';

export const createCompany = async (name: string, logo: string | null, user_id: number) => {
    const newCompany = await prisma.companies.create({
        select: {
            id: true,
            name: true,
            logo: true,
        },
        data: {
            name,
            logo: logo || null,
        },
    });

    await prisma.users.update({
        where: { id: user_id },
        data: {
            main_company_id: newCompany.id,
        },
    });

    return newCompany;
};