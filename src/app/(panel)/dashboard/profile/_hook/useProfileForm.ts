'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'O nome é obrigatório.' })
        .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
        .max(150, { message: 'O nome deve ter no máximo 150 caracteres.' }),
    email: z
        .email({ message: 'O email é inválido.' })
        .min(1, { message: 'O email é obrigatório.' }),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.string(),
    timezone: z.string().min(1, { message: 'O fuso horário é obrigatório.' }),
    times: z.array(z.string()).optional(),
});

interface UseProfileFormProps {
    name: string | null | undefined;
    email: string | null | undefined;
    address: string | null | undefined;
    phone: string | null | undefined;
    status: string | undefined;
    timezone: string | null | undefined;
}
export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
    name,
    email,
    address,
    phone,
    status,
    timezone,
}: UseProfileFormProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: name || '',
            email: email || '',
            address: address || '',
            phone: phone || '',
            status: status || '',
            timezone: timezone || '',
        },
    });
}
