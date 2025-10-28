import Stripe from 'stripe';
// Carregar no server side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-09-30.clover',
});
