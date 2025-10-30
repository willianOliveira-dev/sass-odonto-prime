'use server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateImageProfile(url: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return {
                error: 'Usuário não encontrado.',
            };
        }

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                image: url,
            },
        });

        revalidatePath('/dashboard/profile');

        return {
            data: 'Imagem de perfil atualizada com sucesso!',
        };
    } catch (err) {
        console.log(err);
        return {
            error: 'Erro ao atualizar imagem de perfil.',
        };
    }
}
