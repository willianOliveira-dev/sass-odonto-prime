'use client';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
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
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';

interface AlertDeleteServiceProps {
    service: string;
    onDelete: () => void;
    loading: boolean;
}

export function AlertDeleteService({
    service,
    onDelete,
    loading,
}: AlertDeleteServiceProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    size={'icon'}
                    variant={'default'}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Você tem certeza absoluta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente o serviço "{service} "da lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="cursor-pointer"
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
                    <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
