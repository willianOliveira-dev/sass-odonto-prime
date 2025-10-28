'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'O nome é obrigatório.' })
        .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
        .max(150, { message: 'O nome deve ter no máximo 150 caracteres.' }),
    email: z
        .email({ message: 'O email é inválido.' })
        .min(1, { message: 'O email é obrigatório.' }),
    phone: z.string().min(1, { message: 'O telefone é obrigatório.' }),
    date: z.date().min(1, { message: 'A data é obrigatória.' }),
    serviceId: z.string().min(1, { message: 'O serviço é obrigatório.' }),
    userId: z.string().min(1, { message: 'A clínica é obrigatória.' }),
    time: z.string().min(1, { message: 'O horário é obrigatório.' }),
});

export type CreateAppointmentProps = z.infer<typeof formSchema>;

export async function createNewAppointment(formData: CreateAppointmentProps) {
    const schema = formSchema.safeParse(formData);

    if (!schema.success) {
        return { error: schema.error.issues[0].message };
    }
    try {
        const selectedDate = new Date(formData.date);

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

        await prisma.appointment.create({
            data: {
                userId: schema.data.userId,
                name: schema.data.name,
                email: schema.data.email,
                phone: schema.data.phone,
                appointmentDate,
                serviceId: schema.data.serviceId,
                time: schema.data.time,
            },
        });

        revalidatePath(`/clinic/${schema.data.userId}`); // refrescar o cache da página

        return {
            data: 'Agendamento criado com sucesso!',
        };
        
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao criar agendamento.',
        };
    }
}
