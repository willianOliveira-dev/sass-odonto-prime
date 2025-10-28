'use client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

interface AlertDeleteAppointmentProps {
    patient: string;
    handleCancelAppointment: () => void;
    loading: boolean;
}

export function AlertCancelAppointment({
    handleCancelAppointment,
    patient,
    loading,
}: AlertDeleteAppointmentProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="w-6 h-6 cursor-pointer"
                    variant={'ghost'}
                    size={'icon'}
                >
                    <X />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Você deseja cancelar este agendamento?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso cancelará o
                        agendamento do paciente "{patient}" da lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleCancelAppointment}>
                        {loading ? (
                            <>
                                <LoaderSpinner />
                                <span className="ml-2"> Cancelando...</span>
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
