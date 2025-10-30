'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/helpers/plans/stripe';

export async function createPortalCustomer() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            url: '',
            sessionId: '',
            error: 'Usuário não encontrado.',
        };
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        return {
            url: '',
            sessionId: '',
            error: 'Usuário não encontrado.',
        };
    }

    const sessionId = user.stripeCustomerId;
    if (!sessionId) {
        return {
            url: '',
            sessionId: '',
            error: 'Usuário sem assinatura.',
        };
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: sessionId,
            return_url: process.env.STRIPE_SUCCESS_URL as string,
        });

        return {
            url: portalSession.url,
            sessionId: portalSession.id,
        };
    } catch (error) {
        console.log(error);
        return {
            url: '',
            sessionId: '',
            error: 'Falha ao gerenciar assinatura.',
        };
    }
}
