import Link from 'next/link';
import { Button } from './button';

interface LabelSubscriptionProps {
    expired: boolean;
}

export function LabelSubscription({ expired }: LabelSubscriptionProps) {
    return (
        <>
            {expired && (
                <div className="bg-red-400 text-white text-sm md:text-base px-3 py-2 my-4 rounded-md flex flex-col items-stretch justify-between md:flex-row md:items-center ">
                    <div>
                        <h3 className="text-md font-semibold text-gray-100">
                            Seu plano expirou ou você não possui um plano ativo!
                        </h3>

                        <p className="text-sm text-gray-300">
                            Acesse o seu plano para verificar os detalhes.
                        </p>
                    </div>
                    <Button
                        asChild
                        className=" text-white p-3 rounded-md my-2 transition-all duration-500"
                    >
                        <Link href={'/dashboard/plans'}>Acessar planos</Link>
                    </Button>
                </div>
            )}
        </>
    );
}
