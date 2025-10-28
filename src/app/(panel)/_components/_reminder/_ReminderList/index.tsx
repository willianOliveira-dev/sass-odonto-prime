import Image from 'next/image';
import { format } from 'date-fns';
import characterReminder from '../../../../../../public/character-reminder.png';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Reminder } from '@prisma/client';
import { AlertDeleteReminder } from '../_AlertDeleteReminder';
import { DialogReminder } from '../_DialogReminder';

interface ReminderListProps {
    reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
    return (
        <Card className="h-[450px]">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl md:text-2xl font-bold">
                    Lembretes
                </CardTitle>
                <DialogReminder />
            </CardHeader>
            <CardContent className="space-y-3.5 size-full">
                {reminders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center size-full">
                        <div className="mb-5">
                            <Image
                                src={characterReminder}
                                alt="Personagem de Lembretes"
                                className="w-[250px] lg:w-[350px] opacity-40 select-none pointer-events-none"
                                quality={75}
                                priority
                            />
                        </div>
                        <p className="text-base md:text-xl text-gray-500/30 dark:text-gray-200/30 text-center">
                            Ainda não há lembretes.
                        </p>
                    </div>
                ) : (
                    /* lg:max-h-[calc(100vh - 15rem)] -> 15rem para "desconsiderar" a altura do header */
                    <ScrollArea className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-2.5 flex-1 w-full max-w-full">
                        {reminders.map((reminder) => (
                            <article
                                key={reminder.id}
                                className="px-4 py-2 bg-yellow-200 rounded-lg text-black mt-2"
                            >
                                <div className="flex items-start justify-between gap-2.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm md:text-base break-words">
                                            {reminder.description}
                                        </p>
                                        <span className="text-xs text-yellow-600 p-0.5">
                                            {format(
                                                reminder.createdAt,
                                                'dd/MM/yyyy'
                                            )}
                                        </span>
                                    </div>

                                    <div className="shrink-0 self-center">
                                        <AlertDeleteReminder
                                            reminderId={reminder.id}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
