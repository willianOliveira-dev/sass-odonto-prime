'use server'; // server action
import { signIn } from '@/lib/auth';

type LoginActionProviderProps = 'google' | 'facebook' ;

export async function loginActionProvider(provider: LoginActionProviderProps) {
    await signIn(provider, { redirectTo: '/dashboard' });
}
