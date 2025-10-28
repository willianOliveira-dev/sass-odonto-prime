import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const serviceSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'O nome do serviço é obrigatório.' })
        .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
        .max(150, { message: 'O nome deve ter no máximo 150 caracteres.' }),
    price: z.string(),
    description: z
        .string()
        .max(300, {
            message: 'A descrição deve ter no máximo 300 caracteres.',
        })
        .optional(),
    hours: z.string(),
    minutes: z.string(),
});

export interface UseDialogServiceFormProps {
    initialValues?: {
        name: string;
        description?: string;
        price: string;
        hours: string;
        minutes: string;
    };
}

export type UseDialogServiceFormData = z.infer<typeof serviceSchema>;

export function useDialogServiceForm(props: UseDialogServiceFormProps) {
    const { initialValues } = props ?? {};
    return useForm<UseDialogServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: initialValues ?? {
            name: '',
            description: '',
            price: '',
            hours: '',
            minutes: '',
        },
    });
}
