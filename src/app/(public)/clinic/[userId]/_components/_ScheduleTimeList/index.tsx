'use client';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '../_ScheduleContent';
import { cn } from '@/lib/utils';
import {
    isSlotInThePast,
    isToday,
    isSlotSequenceAvailable,
} from '../../helpers/isSlotInThePast';

interface ScheduleTimeListProps {
    selectedDate: Date;
    selectedTime: string;
    filledSlots: number;
    blockedTimes: string[];
    availableTimeSlots: TimeSlot[];
    clinicTimes: string[];
    onSelectedTime: (time: string) => void;
}

export function ScheduleTimeList({
    selectedDate,
    selectedTime,
    filledSlots,
    blockedTimes,
    availableTimeSlots,
    clinicTimes,
    onSelectedTime,
}: ScheduleTimeListProps) {
    return (
        <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
            {availableTimeSlots.map((slot, idx) => {
                const sequenceOk = isSlotSequenceAvailable({
                    startSlot: slot.time,
                    filledSlots,
                    allSlots: clinicTimes,
                    blockedTimes,
                });

                const slotEnabled = sequenceOk && slot.available;

                const dateIsToday: boolean = isToday(selectedDate);
                const slotIsPast: boolean =
                    dateIsToday && isSlotInThePast(slot.time);

                return (
                    <Button
                        disabled={slotIsPast || !slotEnabled}
                        onClick={() => onSelectedTime(slot.time)}
                        type="button"
                        key={idx}
                        variant={'outline'}
                        className={cn(
                            'h-10 select-none cursor-pointer',
                            selectedTime === slot.time &&
                                'bg-blue-50 hover:bg-blue-100 ring-2 ring-blue-500',
                            (!slotEnabled || slotIsPast) &&
                                'cursor-not-allowed opacity-25'
                        )}
                    >
                        {slot.time}
                    </Button>
                );
            })}
        </div>
    );
}
