'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { cancelAppointment } from '../../../_actions/cancelAppointment';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';
import { AlertCancelAppointment } from '../_AlertCancelAppointment';
import { DialogAppointment } from '../_DialogAppointment';
import { ButtonPickerAppointment } from '../_ButtonPickerAppointment';

interface AppointmentListProps {
    times: string[];
}

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
    include: {
        service: true;
    };
}>;

export function AppointmentList({ times }: AppointmentListProps) {
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    // URL State - Controlar a data via URL. Filtros bem melhores.
    const searchParams = useSearchParams();
    const date = searchParams.get('date');
    const queryClient = useQueryClient();

    // responsável por fazer a requisição HTTP
    const { data, isLoading, refetch } = useQuery({
        // Se o usuário estiver em outra aba, evita chamadas desnecessárias.
        refetchIntervalInBackground: false,
        // Refaz a requisição a cada 5 segundos, forçando a busca de novos dados.
        refetchInterval: 30000,
        // Tempo real em que os dados que vinheram da requisição ficam em catching no navegador.
        staleTime: 15000,
        // Identificador para caso de catching, revalidação de dados, revalidação de catching e invalidação de catching - Para ficar mais fluido e mais rápido a aplicação.
        queryKey: ['get-appointments', date],
        // fetching
        queryFn: async () => {
            let activeDate: string | null = date;
            if (!activeDate) {
                const today: string = format(new Date(), 'yyyy-MM-dd');
                activeDate = today;
            }

            const url: string = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`;

            const res = await fetch(url);
            const json = await res.json();

            if (!res.ok) {
                return [];
            }

            return json as AppointmentWithService[];
        },
    });

    const occupantMap: Record<string, AppointmentWithService> = {};

    if (data && data.length > 0) {
        for (const apt of data) {
            // Calcular quantos slots necessários ocuparam
            const filledSlots: number = Math.ceil(apt.service.duration / 30);
            // Descobrir qual é o indice do nosso array de horários esse agendamento começa.
            const startIndex: number = times.indexOf(apt.time); // 2

            // Se encontrou o index - deveremos iterar
            if (startIndex !== -1) {
                for (let i = 0; i < filledSlots; i++) {
                    const slotIndex = startIndex + i;
                    if (slotIndex < times.length) {
                        occupantMap[times[slotIndex]] = apt;
                    }
                }
            }
        }
    }

    const handleCancelAppointment = async (appointmentId: string) => {
        setLoadingAppointments(true);
        const res = await cancelAppointment({ appointmentId });
        setLoadingAppointments(false);
        if (res.error) {
            toast.error('Erro ao cancelar agendamento:', {
                duration: 5000,
                position: 'bottom-right',
                richColors: true,
                description: res.error,
            });
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['get-appointments'] });
        await refetch();

        toast.success(res.data, {
            duration: 5000,
            position: 'bottom-right',
        });
        return;
    };

    return (
        <Card className="shadow-lg rounded-2xl p-4">
            <CardHeader className="pb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-bold">
                            Agendamentos
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Visão geral dos agendamentos do dia.
                        </CardDescription>
                    </div>
                    <ButtonPickerAppointment datePicker={date!} />
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4 space-y-3">
                    {times.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            Sem agendamentos.
                        </p>
                    ) : isLoading ? (
                        <div className="flex items-center gap-4 justify-center py-6">
                            <LoaderSpinner />
                            <span className="text-base text-gray-400">
                                Procurando agendamentos...
                            </span>
                        </div>
                    ) : (
                        times.map((slot) => {
                            const occupant = occupantMap[slot];

                            return occupant ? (
                                <div
                                    key={slot}
                                    className="flex items-center justify-between py-3 px-4 bg-muted rounded-lg hover:bg-muted/70 transition mb-2.5"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            {slot}
                                        </span>
                                        <span className="text-sm font-bold">
                                            {occupant.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {occupant.service.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {occupant.phone}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <DialogAppointment
                                            appointment={occupant}
                                        />
                                        <AlertCancelAppointment
                                            handleCancelAppointment={() =>
                                                handleCancelAppointment(
                                                    occupant.id
                                                )
                                            }
                                            loading={loadingAppointments}
                                            patient={occupant.name}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={slot}
                                    className="flex items-center justify-between py-3 px-4 border rounded-lg text-sm mb-2.5"
                                >
                                    <span className="font-semibold">
                                        {slot}
                                    </span>
                                    <Badge variant="outline">Disponível</Badge>
                                </div>
                            );
                        })
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
