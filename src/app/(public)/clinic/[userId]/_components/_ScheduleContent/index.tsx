'use client';
import Image from 'next/image';
import foto from '../../../../../../../public/foto1.png';
import { MapPin } from 'lucide-react';
import {
    type AppointmentSchemaData,
    useAppointmentForm,
} from '../../_hooks/useScheduleForm';
import { Prisma } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPhone } from '@/helpers/formatPhone';
import { DateTimePicker } from '../_DatePicker';
import { convertMinutesToHours } from '@/helpers/convertMinutesToHours';
import { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { ScheduleTimeList } from '../_ScheduleTimeList';
import { toast } from 'sonner';
import { createNewAppointment } from '../../_actions/createNewAppointment';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';

type UserWithServicesAndSubscription = Omit<
    Prisma.UserGetPayload<{
        include: {
            services: true;
            subscription: true;
        };
    }>,
    'password'
>;

interface ScheduleContentProps {
    clinic: UserWithServicesAndSubscription;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
    const form = useAppointmentForm();

    const { watch } = form;

    const selectedDate = watch('date');
    const selectServiceId = watch('serviceId');

    const [selectedTime, setSelectedTime] = useState<string>('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(
        []
    );

    const [loadingTimes, setLoadingTimes] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Quais os horários estão bloqueados 07/10/2025 -> ["15:00", "18:00"]
    const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

    // Função que busca os horários bloqueados via fetch HTTP
    const fetchBlockedTimes = useCallback(
        async (date: Date): Promise<string[]> => {
            setLoadingTimes(true);
            try {
                const dateString = date.toISOString().split('T')[0];

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
                );

                const data = await res.json();

                return data;
            } catch (error) {
                console.log(error);
                return [];
            } finally {
                setLoadingTimes(false);
            }
        },
        [clinic.id, selectedDate, selectedTime]
    );

    useEffect(() => {
        if (selectedDate) {
            fetchBlockedTimes(selectedDate).then((blockeds) => {
                setBlockedTimes(blockeds);

                const times = clinic.times || [];

                const availableTimes = times.map((time) => ({
                    time,
                    available: !blockeds.includes(time),
                }));

                const stillAvailable = availableTimes.find(
                    (slot) => slot.time === selectedTime && slot.available
                );

                if (!stillAvailable) {
                    setSelectedTime('');
                }
                // Atualiza os horários disponíveis
                setAvailableTimeSlots(availableTimes);
            });
        }
    }, [
        clinic.id,
        selectedDate,
        clinic.times,
        selectedTime,
        fetchBlockedTimes,
    ]);

    const handleRegisterAppointment = async (values: AppointmentSchemaData) => {
        if (!selectedTime) {
            toast.error('Tente novamente. Horário não selecionado.', {
                richColors: true,
            });
            return;
        }

        const appointment = {
            ...values,
            time: selectedTime,
            userId: clinic.id,
        };

        setLoading(true);

        const res = await createNewAppointment(appointment);

        setLoading(false);

        if (res.error) {
            toast.error('Erro ao criar agendamento:', {
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
        <div className="min-h-screen flex flex-col">
            <div className="h-32 bg-linear-to-r from-blue-500 to-sky-700">
                <section className="container mx-auto px-4 mt-16">
                    <div className="max-w-2xl mx-auto">
                        <article className="flex flex-col items-center">
                            <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white dark:border-background mb-8 sm:w-45 sm:h-45">
                                <Image
                                    src={clinic.image ? clinic.image : foto}
                                    alt="Foto da Clínica"
                                    className="object-cover"
                                    quality={100}
                                    priority
                                    sizes="(max-width: 480px): 100vh, (max-width: 1024px) 75vw, 60w"
                                    fill
                                />
                            </div>
                            <h1 className="text-2xl font-semibold mb-2">
                                {clinic.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {clinic.address
                                        ? clinic.address
                                        : 'Endereço não informado'}
                                </span>
                            </div>
                        </article>
                    </div>
                </section>
                {/* Formulário */}
                <section className="max-w-2xl mx-auto px-4 my-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                handleRegisterAppointment
                            )}
                            className="space-y-6 p-6 mx-2 rounded-md shadow-md border "
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ex: João Silva da Costa"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ex: m@example.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="(XX) XXXXX-XXXX"
                                                type="phone"
                                                onChange={(e) => {
                                                    const formattedValue =
                                                        formatPhone(
                                                            e.target.value
                                                        );
                                                    field.onChange(
                                                        formattedValue
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="date"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                                        <FormLabel className="text-nowrap">
                                            Data do agendamento
                                        </FormLabel>
                                        <FormControl>
                                            <DateTimePicker
                                                initialValue={
                                                    field.value ?? new Date()
                                                }
                                                onSelect={(e) => {
                                                    if (e) {
                                                        field.onChange(e);
                                                        setSelectedTime('');
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="serviceId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serviços</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(e) => {
                                                    field.onChange(e);
                                                    setSelectedTime('');
                                                }}
                                            >
                                                <SelectTrigger
                                                    className="w-full"
                                                    style={{
                                                        height: 50,
                                                    }}
                                                >
                                                    <SelectValue placeholder="Selecione um serviço" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clinic.services.map(
                                                        (service) => (
                                                            <SelectItem
                                                                key={service.id}
                                                                value={
                                                                    service.id
                                                                }
                                                            >
                                                                <div className="flex flex-col gap-0.5 items-start sm:flex-row sm:items-center sm:gap-2">
                                                                    <span>
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </span>
                                                                    <span className="hidden sm:block">
                                                                        -
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {convertMinutesToHours(
                                                                            service.duration
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectServiceId && (
                                <div className="space-y-2">
                                    <Label>Horários disponíveis</Label>
                                    <div className="bg-zinc-100 p-4 rounded-lg dark:bg-zinc-900 ">
                                        {loadingTimes ? (
                                            <p className="text-xs">
                                                Procurando horários...
                                            </p>
                                        ) : availableTimeSlots.length === 0 ? (
                                            <p className="text-xs">
                                                Nenhum horário disponível.
                                            </p>
                                        ) : (
                                            <ScheduleTimeList
                                                onSelectedTime={(time) =>
                                                    setSelectedTime(time)
                                                }
                                                clinicTimes={clinic.times}
                                                blockedTimes={blockedTimes}
                                                availableTimeSlots={
                                                    availableTimeSlots
                                                }
                                                selectedTime={selectedTime}
                                                selectedDate={selectedDate}
                                                filledSlots={
                                                    clinic.services.find(
                                                        (service) =>
                                                            service.id ===
                                                            selectServiceId
                                                    )
                                                        ? clinic.services.find(
                                                              (service) =>
                                                                  service.id ===
                                                                  selectServiceId
                                                          )!.duration / 30
                                                        : 1
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {clinic.status ? (
                                <Button
                                    type="submit"
                                    disabled={
                                        !watch('name') ||
                                        !watch('email') ||
                                        !watch('phone') ||
                                        !watch('date') ||
                                        !watch('serviceId')
                                    }
                                    className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded-3xl cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderSpinner />
                                            <span className="ml-2">
                                                Realizando agendamento...
                                            </span>
                                        </>
                                    ) : (
                                        'Realizar agendamento'
                                    )}
                                </Button>
                            ) : (
                                <p className="text-white bg-red-500/90 rounded-md px-4 py-2 text-center">
                                    A clínica está fechada nesse momento.
                                </p>
                            )}
                        </form>
                    </Form>
                </section>
            </div>
        </div>
    );
}
