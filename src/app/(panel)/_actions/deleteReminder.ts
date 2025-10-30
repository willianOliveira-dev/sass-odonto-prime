'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    reminderId: z
        .string()
        .min(1, { message: 'O id do lembrete é obrigatório.' }),
});

type DeleteReminderProps = z.infer<typeof formSchema>;

export async function deleteReminder({ reminderId }: DeleteReminderProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const schema = formSchema.safeParse({ reminderId });

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message,
        };
    }

    try {
        await prisma.reminder.delete({
            where: {
                userId,
                id: reminderId,
            },
        });

        revalidatePath('/dashboard');

        return {
            data: 'Lembrete deletado com sucesso!',
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao deletar lembrete',
        };
    }
}
