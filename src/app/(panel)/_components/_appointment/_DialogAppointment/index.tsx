import { AppointmentWithService } from '../_AppointmentList';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/helpers/formatCurrency';
import { format } from 'date-fns';
import { convertMinutesToHours } from '@/helpers/convertMinutesToHours';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

interface DialogAppointmentProps {
    appointment: AppointmentWithService;
}

export function DialogAppointment({ appointment }: DialogAppointmentProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-6 h-6 cursor-pointer"
                    variant={'ghost'}
                    size={'icon'}
                >
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Detalhes do agendamento
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Veja todos os detalhes do agendamento
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {appointment && (
                        <article className="flex items-center justify-center">
                            <div className="space-y-1.5 w-full rounded-2xl">
                                <div className="space-y-3 rounded-xl px-3 py-2 ">
                                    <p>
                                        <span className="font-medium">
                                            Data do agendamento:
                                        </span>{' '}
                                        {Intl.DateTimeFormat('pt-BR', {
                                            timeZone: 'UTC',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).format(
                                            new Date(
                                                appointment.appointmentDate
                                            )
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Horário agendado:
                                        </span>{' '}
                                        {appointment.time}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Duração:
                                        </span>{' '}
                                        {convertMinutesToHours(
                                            appointment.service.duration
                                        )}
                                    </p>
                                </div>

                                <div className="space-y-3 rounded-xl px-3 py-2 ">
                                    <p>
                                        <span className="font-medium">
                                            Nome:
                                        </span>{' '}
                                        {appointment.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            E-mail:
                                        </span>{' '}
                                        {appointment.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Telefone:
                                        </span>{' '}
                                        {appointment.phone}
                                    </p>
                                </div>

                                <div className="space-y-3 rounded-xl px-3 py-2 bg-gray-200 dark:bg-gray-500">
                                    <p>
                                        <span className="font-medium">
                                            Serviço:
                                        </span>{' '}
                                        {appointment.service.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Preço:
                                        </span>{' '}
                                        {formatCurrency(
                                            appointment.service.price / 100
                                        )}
                                    </p>
                                </div>
                            </div>
                        </article>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
