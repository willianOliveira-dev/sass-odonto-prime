'use client';

import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';

import { PLANS_DATA } from '@/helpers/plans/plans';
import { Check } from 'lucide-react';
import { SubscriptionButton } from '../_SubscriptionButton';
import { Plan } from '@prisma/client';

export function GridPlans() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PLANS_DATA.map((plan) => (
                <Card
                    className="dark:bg-card/50 backdrop-blur-xl w-full mx-auto"
                    key={plan.id}
                >
                    <CardHeader>
                        <CardTitle
                            className={`text-xl font-semibold ${plan.foreground}`}
                        >
                            {plan.name}
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <article className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-3">
                                <span className="line-through">
                                    R$ {plan.oldPrice}
                                </span>
                                <div className="flex font-bold">
                                    <span
                                        className={`text-lg ${plan.foreground}`}
                                    >
                                        R$
                                    </span>
                                    <p className="ml-0.5 text-5xl">
                                        {plan.price}
                                    </p>
                                </div>
                            </div>

                            <SubscriptionButton plan={plan.id as Plan} />

                            <ul className="space-y-1.5">
                                {plan.features.map((feat, idx) => (
                                    <li
                                        className="flex items-center justify-start gap-2 text-xs sm:text-sm"
                                        key={idx}
                                    >
                                        <span
                                            className={`p-0.5 rounded-full shrink-0 min-w-0 ${plan.background}`}
                                        >
                                            <Check className="text-white w-3 h-3 min-w-0" />
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
