'use server';

import prisma from '@/lib/prisma';

interface GetSubscriptionProps {
    userId: string;
}

export async function getSubscription({ userId }: GetSubscriptionProps) {
    if (!userId) {
        return null;
    }

    try {
        const subscription = await prisma.subscription.findUnique({
            where: {
                userId,
            },
        });

        return subscription;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}
