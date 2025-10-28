'use client';
import { Subscription } from '@prisma/client';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription,
} from '@/components/ui/card';
import { PLANS_DATA } from '@/helpers/plans/plans';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortalCustomer } from '../../_actions/createPortalCustomer';
import { useState } from 'react';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';

interface SubscriptionDetailsProps {
    subscription: Subscription;
}

export function SubscriptionDetails({
    subscription,
}: SubscriptionDetailsProps) {
    const plan = PLANS_DATA.find((plan) => plan.id === subscription.plan);
    const [loading, setLoading] = useState<boolean>(false);
    const handleManageSubscription = async () => {
        setLoading(true);
        const portal = await createPortalCustomer();
        setLoading(false);
        if (portal.error) {
            toast.error('Erro ao gerenciar plano:', {
                duration: 5000,
                position: 'bottom-right',
                richColors: true,
                description: portal.error,
            });
            return;
        }

        window.location.href = portal.url!;
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="font-semibold text-xl">
                    Seu Plano atual
                </CardTitle>
                <CardDescription>Sua assintatura está ativa.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full space-y-3.5">
                    <div className="flex items-center justify-between">
                        <h2
                            className={`font-semibold text-lg ${
                                plan?.foreground && plan.foreground
                            }`}
                        >
                            {subscription.plan}
                        </h2>
                        <span className="text-center font-semibold w-20 px-3 py-2 rounded-lg text-white bg-emerald-500">
                            ATIVO
                        </span>
                    </div>
                    <ul className="space-y-1.5">
                        {plan?.features &&
                            plan.features.map((feat, idx) => (
                                <li
                                    className="flex items-center justify-start gap-2 text-xs sm:text-sm"
                                    key={idx}
                                >
                                    <span
                                        className={cn(
                                            'p-0.5 rounded-full shrink-0 min-w-0',
                                            plan.background && plan.background
                                        )}
                                    >
                                        <Check className="text-white w-3 h-3 min-w-0" />
                                    </span>
                                    {feat}
                                </li>
                            ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className={`cursor-pointer hover:scale-102 duration-300 ${
                        plan?.background && plan?.background
                    }`}
                    onClick={handleManageSubscription}
                >
                    {loading ? (
                        <>
                            <LoaderSpinner />
                            <span>Carregando...</span>
                        </>
                    ) : (
                        'Gerenciar assinatura'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
