'use server';
import prisma from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    serviceId: z.string().min(1, { message: 'O id do serviço é obrigatório.' }),
});

type DeleteServiceProps = z.infer<typeof formSchema>;

export async function deleteService({ serviceId }: DeleteServiceProps) {
    const session = await getSession();

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const schema = formSchema.safeParse({ serviceId });

    if (!schema.success) {
        return { error: schema.error.issues[0].message };
    }

    try {
        await prisma.service.delete({
            where: {
                id: serviceId,
                userId: userId,
            },
        });

        revalidatePath('/dashboard/services');

        return {
            data: 'Serviço deletado com sucesso!',
        };
        
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao deletar serviço.',
        };
    }
}
