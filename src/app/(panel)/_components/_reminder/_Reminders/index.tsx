'use server';

import { getReminders } from '../../../_data-access-layer/getReminders';
import { ReminderList } from '../_ReminderList';

interface RemindersProps {
    userId: string;
}

export async function Reminders({ userId }: RemindersProps) {
    const reminders = await getReminders({ userId });
    return <ReminderList reminders={reminders} />;
}
