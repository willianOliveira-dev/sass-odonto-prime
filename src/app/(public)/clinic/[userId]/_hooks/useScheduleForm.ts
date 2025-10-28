'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const appointmentSchema = z.object({
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
});

export type AppointmentSchemaData = z.infer<typeof appointmentSchema>;

export function useAppointmentForm() {
    return useForm<AppointmentSchemaData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            date: new Date(),
            serviceId: '',
        },
    });
}
