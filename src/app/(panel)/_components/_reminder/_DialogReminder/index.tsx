'use client';
import { createNewReminder } from '@/app/(panel)/_actions/createNewReminder';
import {
    type ReminderFormProps,
    useReminderForm,
} from '@/app/(panel)/hooks/useReminderForm';
import { Button } from '@/components/ui/button';
import {
    FormField,
    Form,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from '@/components/ui/form';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';

export function DialogReminder() {
    const form = useReminderForm();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSetOpen = () => {
        if (loading) return;
        form.reset();
        setOpen((open) => !open);
    };

    const onSubmit = async ({ description }: ReminderFormProps) => {
        setLoading(true);
        const res = await createNewReminder({ description });
        setOpen(false);
        setLoading(false);

        if (res.error) {
            toast.error('Erro ao criar lembrete:', {
                duration: 5000,
                position: 'bottom-right',
                richColors: true,
                description: res.error,
            });

            return;
        }

        toast.success(res.data, {
            duration: 5000,
            position: 'bottom-right',
        });

        return;
    };

    return (
        <Dialog open={open} onOpenChange={handleSetOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className="w-9 p-0 cursor-pointer">
                    <Plus className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo lembrete</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Criar um novo lembrete para sua lista.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="space-y-2.5">
                                    <FormLabel>Descreva o lembrete</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Digite a descrição do lembrete..."
                                            className="max-h-56"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={loading}
                            className="w-full cursor-pointer"
                            type="submit"
                        >
                            {loading ? (
                                <>
                                    <LoaderSpinner />
                                    <span className="ml-2">Carregando...</span>
                                </>
                            ) : (
                                'Cadastrar lembrete'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
