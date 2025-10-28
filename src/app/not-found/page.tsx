'use client';
import Image from 'next/image';
import Link from 'next/link';
import error404Image from '../../../public/erro-404.png';
import logoOdonto from '../../../public/logo-odonto.png';
import { Button } from '@/components/ui/button';

export default function Page404() {
    return (
        <section className="flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col gap-6 items-center justify-center">
                <Image
                    src={logoOdonto}
                    alt="Logo OdontoPrime"
                    priority
                    className="block"
                    quality={75}
                    width={100}
                />
                <Image
                    src={error404Image}
                    alt="Página não encontrada."
                    priority
                    className="block"
                    quality={75}
                    width={400}
                />
                <div className="space-y-3.5 text-center">
                    <h1 className="text-xl font-semibold sm:text-2xl">
                        Página não encontrada.
                    </h1>
                    <p className='text-sm'>Ops! A página que você está procurando não existe.</p>
                </div>
                <Button
                    asChild
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    <Link href={'/'}>Voltar para a Página Inicial</Link>
                </Button>
            </div>
        </section>
    );
}
