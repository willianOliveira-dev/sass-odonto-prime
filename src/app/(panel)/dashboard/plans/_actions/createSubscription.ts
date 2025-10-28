'use server';
import getSession from '@/lib/getSession';
import prisma from '@/lib/prisma';
import { stripe } from '../../../../../helpers/plans/stripe';
import { Plan } from '@prisma/client';

interface CreateSubscriptionProps {
    plan: Plan;
}

const PLANS_MAP = {
    BASIC: process.env.STRIPE_PLAN_BASIC,
    PROFESSIONAL: process.env.STRIPE_PLAN_PROFESSIONAL,
    PREMIUM: process.env.STRIPE_PLAN_PREMIUM,
};

export async function createSubscrition({ plan }: CreateSubscriptionProps) {
    const session = await getSession();

    if (!session?.user) {
        return {
            checkoutSessionId: '',
            url: '',
            error: 'Falha ao assinar plano.',
        };
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return {
            checkoutSessionId: '',
            url: '',
            error: 'Usuário não encontrado.',
        };
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        // Caso o usuário não tenha uma assinatura, criamos no stripe.
        const stripeCustomer = await stripe.customers.create({
            email: user.email!, // apenas o email é obrigatório.
        });

        await prisma.user.update({
            data: {
                stripeCustomerId: stripeCustomer.id,
            },
            where: {
                id: userId,
            },
        });

        customerId = stripeCustomer.id;
    }

    // CRIAR O CHECKOUT
    try {
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{ price: PLANS_MAP[plan], quantity: 1 }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            // podemos passar o que quisermos para marcar qual o produto o cliente está consumindo
            metadata: {
                plan,
            },
        });

        return {
            // id da sessão de checkout
            checkoutSessionId: stripeCheckoutSession.id,
            url: stripeCheckoutSession.url,
        };
    } catch (error) {
        console.log(error);
        return {
            checkoutSessionId: '',
            url: '',
            error: 'Falha ao assinar plano.',
        };
    }
}
