'use server';
import { Plan } from '@prisma/client';
import { PlansProps } from '../plans';

const PLANS_LIMITS: PlansProps = {
    BASIC: {
        maxServices: 10,
    },
    PROFESSIONAL: {
        maxServices: 50,
    },
    PREMIUM: {
        maxServices: Infinity,
    },
};

interface GetPlansProps {
    planId: Plan;
}

export async function getPlans({ planId }: GetPlansProps) {
    return PLANS_LIMITS[planId];
}
