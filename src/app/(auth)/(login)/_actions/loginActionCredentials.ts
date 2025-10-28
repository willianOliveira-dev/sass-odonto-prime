import { signIn } from '@/lib/auth';

export async function loginActionCredentials(email: string, password: string) {
    await signIn('credentials', {
        email,
        password,
        redirect: false,
    });
}
