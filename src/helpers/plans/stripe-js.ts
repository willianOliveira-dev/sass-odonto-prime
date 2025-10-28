import { loadStripe } from '@stripe/stripe-js';
// Carregar no client side
export async function getStripe() {
    const stripeJs = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    );
    return stripeJs;
}
