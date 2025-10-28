// por conta dos colchetes se torna uma rota dinâmica
'use server';
import { ScheduleContent } from './_components/_ScheduleContent';
import { redirect } from 'next/navigation';
import { getInfoSchedule } from './_data-access-layer/get-info-schedule';

interface SchedulePagePros {
    params: Promise<{ userId: string }>;
}

export default async function SchedulePage({ params }: SchedulePagePros) {
    const { userId } = await params;

    const user = await getInfoSchedule({ userId });

    if (!user) {
        redirect('/not-found');
    }

    return <ScheduleContent clinic={user} />;
}
