'use client';
import { signIn } from 'next-auth/react';

type LoginActionProviderProps = 'google' | 'facebook';

export async function loginActionProvider(provider: LoginActionProviderProps) {
    await signIn(provider, { redirectTo: '/dashboard' });
}
