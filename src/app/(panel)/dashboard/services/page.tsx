'use server';
import { Suspense } from 'react';
import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';
import { ServicesContent } from './_components/_ServicesContent';
import { LoaderFallback } from '../../_components/LoaderFallback';

export default async function ServicesPage() {
    const session = await getSession();
    const isVerified = session?.user.emailVerified;

    if (!session) {
        redirect('/');
    }

    if (!isVerified) {
        redirect('/verify');
    }

    return (
        // Streaming de Dados
        <Suspense fallback={<LoaderFallback text="Carregando serviços..." />}>
            <ServicesContent userId={session.user.id} />
        </Suspense>
    );
}
