import Stripe from 'stripe';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/helpers/plans/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { manageSubscription } from '@/helpers/plans/manage-subscription';
import { Plan } from '@prisma/client';
// receber eventos da stripe
export async function POST(req: NextRequest) {
    let managementSubscription;
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.error();
    }

    const text = await req.text();
    // acessar eventos - Fazer verificação de assinatura
    const events = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_SECRET_WEBHOOK_KEY as string
    );

    switch (events.type) {
        case 'customer.subscription.deleted':
            // Deletar uma assinatura do usuário
            const payment = events.data.object as Stripe.Subscription;
            managementSubscription = await manageSubscription(
                payment.id,
                String(payment.customer)
            );
            managementSubscription &&
                (await managementSubscription.deleteAction());
            break;

        case 'customer.subscription.updated':
            // Atualizar uma assinatura do usuário
            const paymentIntent = events.data.object as Stripe.Subscription;
            managementSubscription = await manageSubscription(
                paymentIntent.id,
                String(paymentIntent.customer)
            );
            managementSubscription &&
                (await managementSubscription.updateAction());
            break;

        case 'checkout.session.completed':
            // Criando uma nova assinatura do usuário
            const checkoutSession = events.data
                .object as Stripe.Checkout.Session;
            const plan = checkoutSession.metadata?.plan
                ? checkoutSession.metadata.plan
                : 'BASIC';
            if (checkoutSession.subscription && checkoutSession.customer) {
                managementSubscription = await manageSubscription(
                    String(checkoutSession.subscription),
                    String(checkoutSession.customer),
                    plan as Plan
                );
            }
            managementSubscription &&
                (await managementSubscription.createAction());
            break;
    }

    revalidatePath('/dashboard/plans');

    return NextResponse.json({ received: true });
}
