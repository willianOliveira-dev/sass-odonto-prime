'use server';
import { Session } from 'next-auth';
import { addDays, isAfter } from 'date-fns';
import { ResultPermissionProps } from './canPermissions';

const TRIAL_DAYS = 7;

export async function checkSubscriptionExpired(
    session: Session
): Promise<ResultPermissionProps> {
    const { createdAt } = session.user;

    const trailEndDate = addDays(createdAt, TRIAL_DAYS);

    if (isAfter(new Date(), trailEndDate)) {
        return {
            hasPermission: false,
            planId: 'EXPIRED',
            expired: true,
            plan: null,
        };
    }
    return {
        hasPermission: true,
        planId: 'TRIAL',
        expired: false,
        plan: null,
    };
}
