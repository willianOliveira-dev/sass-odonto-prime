'use server';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ServicesContent } from './_components/_ServicesContent';
import { LoaderFallback } from '../../_components/LoaderFallback';

export default async function ServicesPage() {
    const session = await getServerSession(authOptions);
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
