'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { GridPlans } from './_components/_GridPlans';
import { getSubscription } from '../../_data-access-layer/getSubscription';
import { SubscriptionDetails } from './_components/_SubscriptionDetails';

export default async function PlansPage() {
    const session = await getServerSession(authOptions);
    const isVerified = session?.user.emailVerified;

    if (!session) {
        redirect('/');
    }

    if (!isVerified) {
        redirect('/verify');
    }

    const subscription = await getSubscription({ userId: session.user.id });

    return (
        <>
            {subscription?.status !== 'active' ? (
                <GridPlans />
            ) : (
                <SubscriptionDetails subscription={subscription} />
            )}
        </>
    );
}
