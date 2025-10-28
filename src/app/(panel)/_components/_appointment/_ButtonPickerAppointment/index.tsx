'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

interface ButtonPickerAppointmentProps {
    datePicker: string;
}

export function ButtonPickerAppointment({
    datePicker,
}: ButtonPickerAppointmentProps) {
    const router = useRouter();

    let [year, month, day] = datePicker
        ? datePicker.split('-').map(Number)
        : format(new Date(), 'yyyy-MM-dd').split('-').map(Number);

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>(new Date(year, month - 1, day));

    const handleChangeDate = (date: Date | undefined) => {
        if (date) {
            setOpen(false);
            setDate(date);
            const url = new URL(window.location.href);
            url.searchParams.set('date', format(date, 'yyyy-MM-dd'));
            router.replace(url.href.toString());
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        type="button"
                        className="flex justify-between items-center w-full font-normal cursor-pointer"
                    >
                        {date
                            ? Intl.DateTimeFormat('pt-BR', {
                                  timeZone: 'UTC',
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                              }).format(new Date(date))
                            : 'Selecione a data de agendamento'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        locale={ptBR}
                        onSelect={handleChangeDate}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
