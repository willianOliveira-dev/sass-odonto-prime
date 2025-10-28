'use client';

import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

interface DateTimePickerProps {
    initialValue?: Date;
    onSelect: (date: Date) => void;
}

export function DateTimePicker({
    initialValue,
    onSelect,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>(initialValue ?? new Date());
    console.log(date)

    return (
        <div className="flex flex-col gap-3 w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        type='button'
                        className="flex justify-between items-center w-full font-normal"
                    >
                        {date
                            ? Intl.DateTimeFormat('pt-br', {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            }).format(date)
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
                        disabled={{ before: new Date() }}
                        onSelect={(date) => {
                            if (date) {
                                setOpen(false);
                                setDate(date);
                                onSelect(date);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
