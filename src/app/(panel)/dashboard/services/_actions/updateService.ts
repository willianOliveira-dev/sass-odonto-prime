'use server';
import prisma from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'O nome do serviço é obrigatório.' })
        .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
        .max(150, { message: 'O nome deve ter no máximo 150 caracteres.' }),
    description: z
        .string()
        .max(300, {
            message: 'A descrição deve ter no máximo 300 caracteres.',
        })
        .optional(),
    price: z.number(),
    duration: z.int(),
    serviceId: z.string().min(1, { message: 'O id do serviço é obrigatório.' }),
});

type UpdateServiceProps = z.infer<typeof formSchema>;

export async function updateService(formData: UpdateServiceProps) {
    const session = await getSession();

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const schema = formSchema.safeParse(formData);

    if (schema.error) {
        return { error: schema.error.issues[0].message };
    }

    const { name, price, duration, description, serviceId } = schema.data;
    try {
        await prisma.service.update({
            where: {
                userId,
                id: serviceId,
            },
            data: {
                name,
                description,
                duration,
                price,
            },
        });
        revalidatePath('/dashboard/services'); // refrescar o cache da página

        return {
            data: 'Serviço atualizado com sucesso!',
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao atualizar serviço.',
        };
    }
}
