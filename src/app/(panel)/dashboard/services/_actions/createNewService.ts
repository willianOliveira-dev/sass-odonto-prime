'use server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
});

type CreateServiceProps = z.infer<typeof formSchema>;

export async function createNewService(formData: CreateServiceProps) {
    const session = await getServerSession(authOptions);
    const schema = formSchema.safeParse(formData); // Validar se os valores passados batem com a nossa validação.

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    if (!schema.success) {
        return { error: schema.error.issues[0].message };
    }

    const { name, price, duration, description } = schema.data;

    try {
        await prisma.service.create({
            data: {
                name,
                description,
                duration,
                price,
                userId,
            },
        });

        revalidatePath('/dashboard/services'); // refrescar o cache da página

        return {
            data: 'Serviço criado com sucesso!',
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao criar serviço.',
        };
    }
}
