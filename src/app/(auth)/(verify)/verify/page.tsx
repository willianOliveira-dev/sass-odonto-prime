'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VerifyContent } from '../_components/_Verify';
import { redirect } from 'next/navigation';

export default async function VerifyPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    const isVerified = session?.user.emailVerified;

    if (isVerified) {
        redirect('/dashboard');
    }

    return (
        <VerifyContent userId={session.user.id} email={session.user.email!} />
    );
}
