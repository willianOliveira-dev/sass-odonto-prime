'use server';
import { Suspense } from 'react';
import getSession from '@/lib/getSession';

import { redirect } from 'next/navigation';
import { LoaderFallback } from '../../_components/LoaderFallback';
import { Profile } from './_components/_Profile';

export default async function ProfilePage() {
    const session = await getSession();
    const isVerified = session?.user.emailVerified;

    if (!session) {
        redirect('/');
    }

    if (!isVerified) {
        redirect('/verify');
    }
    const userId = session.user.id;
    return (
        <Suspense fallback={<LoaderFallback text="Carregando perfil..." />}>
            <Profile userId={userId} />
        </Suspense>
    );
}
