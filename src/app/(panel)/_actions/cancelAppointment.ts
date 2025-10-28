'use server';
import prisma from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    appointmentId: z.string().min(1, 'O Id do agendamento é obrigatório.'),
});

type DeleteAppointmentProps = z.infer<typeof formSchema>;

export async function cancelAppointment({
    appointmentId,
}: DeleteAppointmentProps) {
    const session = await getSession();

    if (!session) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const schema = formSchema.safeParse({ appointmentId });

    if (schema.error) {
        return {
            error: schema.error.issues[0].message,
        };
    }

    try {
        await prisma.appointment.delete({
            where: {
                id: appointmentId,
                userId,
            },
        });

        revalidatePath('/dashboard');
        return {
            data: 'Agendamento cancelado com sucesso!',
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao cancelar agendamento.',
        };
    }
}
