'use client';
import { signIn } from 'next-auth/react';

export async function loginActionCredentials(email: string, password: string) {
    await signIn('credentials', {
        email,
        password,
        redirect: false,
    });
}
