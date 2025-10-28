import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const reminderForm = z.object({
    description: z
        .string()
        .min(1, 'Descrição é obrigatória.')
        .max(400, 'Descrição deve ter no máximo 400 caracteres.')
        .trim(),
});

export type ReminderFormProps = z.infer<typeof reminderForm>;

export function useReminderForm() {
    return useForm<ReminderFormProps>({
        resolver: zodResolver(reminderForm),
        defaultValues: {
            description: '',
        },
    });
}
