import prisma from '@/lib/prisma';
import { stripe } from './stripe';
import { type Plan } from '@prisma/client';

interface ActionsSubscription {
    createAction: () => Promise<void>;
    updateAction: () => Promise<void>;
    deleteAction: () => Promise<void>;
}

interface ManageSubscription {
    (
        subscriptionId: string,
        customerId: string,
        type?: Plan
    ): Promise<ActionsSubscription | void>;
}

/**
 * Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de dados, sincronizando com a Stripe.
 */
export const manageSubscription: ManageSubscription = async (
    subscriptionId,
    customerId,
    type
) => {

    const findUser = await prisma.user.findUnique({
        where: {
            stripeCustomerId: customerId,
        },
    });

    if (!findUser) {
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return {
        createAction: async function (): Promise<void> {
            await prisma.subscription.create({
                data: {
                    id: subscription.id,
                    userId: findUser.id,
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                    plan: type as Plan,
                },
            });
        },
        updateAction: async function (): Promise<void> {
            const findSubscription = await prisma.subscription.findUnique({
                where: {
                    id: subscriptionId,
                },
            });

            if (!findSubscription) return;

            await prisma.subscription.update({
                data: {
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                },
                where: {
                    id: subscriptionId,
                },
            });
        },
        deleteAction: async function (): Promise<void> {
            await prisma.subscription.delete({
                where: {
                    id: subscriptionId,
                },
            });
        },
    };
};
