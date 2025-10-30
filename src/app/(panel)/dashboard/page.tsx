'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { ButtonCopyLink } from '../_components/_ButtonCopyLink';
import { Reminders } from '../_components/_reminder/_Reminders';
import { Appointments } from '../_components/_appointment/_Appointments';
import { Suspense } from 'react';
import { LoaderFallback } from '../_components/LoaderFallback';

// Podemos chamar o componente de assincrono diretamente
// pois ele é um Server Component por padrão
export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const isVerified = session?.user.emailVerified;

    if (!session) {
        redirect('/');
    }

    if (!isVerified) {
        redirect('/verify');
    }

    return (
        <Suspense fallback={<LoaderFallback text="Carregando panel..." />}>
            <section className="space-y-3">
                <div className="space-x-2 flex items-center justify-end">
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        asChild
                    >
                        <Link
                            href={`/clinic/${session.user.id}`}
                            target="_blank"
                        >
                            <Calendar /> <span>Novo agendamento</span>
                        </Link>
                    </Button>
                    <ButtonCopyLink />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Appointments userId={session.user.id} />
                    <Reminders userId={session.user.id} />
                </div>
            </section>
        </Suspense>
    );
}
