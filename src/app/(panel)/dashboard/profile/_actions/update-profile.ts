'use server'; // server action
import prisma from '@/lib/prisma';
import getSession from '@/lib/getSession';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'O nome é obrigatório' })
        .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
        .max(150, { message: 'O nome deve ter no máximo 150 caracteres.' }),
    email: z
        .email({ message: 'O email é inválido.' })
        .min(1, { message: 'O email é obrigatório.' }),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean(),
    timezone: z.string().min(1, { message: 'O time zone é obrigatório' }),
    times: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

// sempre uma server action deve ser assícrona
export async function updateProfile(formData: FormSchema) {
    const session = await getSession();
    const schema = formSchema.safeParse(formData);

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }

    if (!schema.success) {
        return { error: schema.error.issues[0].message };
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                phone: formData.phone,
                status: formData.status,
                timezone: formData.timezone,
                times: formData.times ?? [],
            },
        });

        revalidatePath('/dashboard/profile'); // refrescar o cache da página

        return {
            data: 'Clínica atualizada com sucesso!',
        };
        
    } catch (error) {
        console.log(error);
        return {
            error: 'Falha ao atualizar clínica.',
        };
    }
}
