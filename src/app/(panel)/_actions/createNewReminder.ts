'use server';
import prisma from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
    description: z
        .string()
        .min(1, 'Descrição é obrigatória.')
        .max(400, 'Descrição deve ter no máximo 400 caracteres.'),
});

type CreateNewReminderProps = z.infer<typeof formSchema>;

export async function createNewReminder({
    description,
}: CreateNewReminderProps) {
    const session = await getSession();

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const schema = formSchema.safeParse({ description });

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message,
        };
    }

    try {
        await prisma.reminder.create({
            data: {
                description,
                userId,
            },
        });

        revalidatePath('/dashboard');

        return {
            data: 'Lembrete criado com sucesso!',
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao criar lembrete.',
        };
    }
}
