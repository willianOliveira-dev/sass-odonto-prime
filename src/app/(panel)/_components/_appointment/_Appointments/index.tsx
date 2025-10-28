'use server';
import { getTimesClinic } from '@/app/(panel)/_data-access-layer/getTimesClinic';
import { AppointmentList } from '../_AppointmentList';

interface AppointmentsProps {
    userId: string;
}
export async function Appointments({ userId }: AppointmentsProps) {
    const { times } = await getTimesClinic({ userId });

    return <AppointmentList times={times} />;
}
