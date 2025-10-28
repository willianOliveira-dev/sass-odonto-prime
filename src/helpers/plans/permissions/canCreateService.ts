'use server';
import prisma from '@/lib/prisma';
import { Subscription } from '@prisma/client';
import { Session } from 'next-auth';
import { getPlans } from './getPlans';
import { PLANS } from '../plans';
import { checkSubscriptionExpired } from './checkSubscriptionExpired';
import { ResultPermissionProps } from './canPermissions';

interface CanCreateServiceProps {
    subscription: Subscription | null;
    session: Session;
}
export async function canCreateService({
    subscription,
    session,
}: CanCreateServiceProps): Promise<ResultPermissionProps> {
    try {
        const userId = session.user.id;
        const serviceCount = await prisma.service.count({
            where: {
                userId,
            },
        });

        if (subscription && subscription.status === 'active') {
            const plan = subscription.plan;
            const planLimits = await getPlans({ planId: plan });

            return {
                hasPermission:
                    planLimits.maxServices === Infinity ||
                    serviceCount <= planLimits.maxServices,
                planId: plan,
                expired: false,
                plan: PLANS[plan],
            };
        }

        const checkTestLimit = await checkSubscriptionExpired(session);

        return checkTestLimit;
    } catch (error) {
        return {
            hasPermission: false,
            planId: 'EXPIRED',
            expired: true,
            plan: null,
        };
    }
}
