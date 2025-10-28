'use client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteReminder } from '../../../_actions/deleteReminder';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';

interface AlertDeleteReminderProps {
    reminderId: string;
}

export function AlertDeleteReminder({ reminderId }: AlertDeleteReminderProps) {
    const [loading, setLoading] = useState(false);

    const handleDeleteReminder = async (reminderId: string) => {
        setLoading(true);
        const res = await deleteReminder({ reminderId });
        setLoading(false);
        if (res.error) {
            toast.error('Erro ao deletar lembrete:', {
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size={'sm'}
                    className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 shrink-0 min-w-0 rounded-full cursor-pointer"
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Você deseja excluir este lembrete?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => handleDeleteReminder(reminderId)}
                    >
                        {loading ? (
                            <>
                                <LoaderSpinner />
                                <span className="ml-2"> Deletando...</span>
                            </>
                        ) : (
                            'Continuar'
                        )}
                    </AlertDialogAction>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
