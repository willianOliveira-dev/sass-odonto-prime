'use client';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Plan } from '@prisma/client';
import { createSubscrition } from '../../_actions/createSubscription';
import { toast } from 'sonner';
import { getStripe } from '@/helpers/plans/stripe-js';
import { useState } from 'react';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';

interface SubscriptionButtonProps {
    plan: Plan;
}

export function SubscriptionButton({ plan }: SubscriptionButtonProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreateBilling = async () => {
        setLoading(true);
        const res = await createSubscrition({ plan });
        setLoading(false);
        if (res.error) {
            toast.error('Erro ao assinar plano:', {
                duration: 5000,
                position: 'bottom-right',
                richColors: true,
                description: res.error,
            });
            return;
        }
        const stripe = await getStripe();

        if (stripe && res.url) {
            window.location.href = res.url;
        }
    };
    return (
        <Button
            onClick={handleCreateBilling}
            className={clsx(
                'text-white cursor-pointer rounded-full hover:scale-102 duration-500',
                {
                    'bg-gradient-to-l to-blue-400 via-blue-600 from-sky-800':
                        plan === 'BASIC',
                    'bg-gradient-to-l to-amber-400 via-pink-500 from-indigo-800':
                        plan === 'PROFESSIONAL',
                    'bg-gradient-to-l to-indigo-400 via-cyan-500 from-lime-500':
                        plan === 'PREMIUM',
                }
            )}
        >
            {loading ? (
                <>
                    <LoaderSpinner />
                    <span>Carregando...</span>
                </>
            ) : (
                'Assinar'
            )}
        </Button>
    );
}
