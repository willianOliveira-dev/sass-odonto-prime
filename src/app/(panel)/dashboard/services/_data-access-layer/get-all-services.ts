import prisma from '@/lib/prisma';

interface GetAllServicesProps {
    userId: string;
}

export async function getAllServices({ userId }: GetAllServicesProps) {
    if (!userId) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    try {
        const services = await prisma.service.findMany({
            where: {
                userId: userId,
                status: true,
            },
        });

        return {
            data: services,
        };
    } catch (error) {
        return {
            error: 'Falha ao buscar serviços.',
        };
    }
}
