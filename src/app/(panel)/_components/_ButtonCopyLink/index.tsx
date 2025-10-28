'use client';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { getSession } from 'next-auth/react';
import { Check, LinkIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ButtonCopyLink() {
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Função para copiar o link para a área de transferência
    const handleCopyLink = async () => {
        const session = await getSession();
        if (session?.user) {
            const userId = session.user.id;
            setIsConfirmed(true);
            toast.success('Link copiado com sucesso!', {
                duration: 2000,
            });

            await navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_URL}/clinic/${userId}`
            );

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setIsConfirmed(false);
            }, 2000);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger className="relative" asChild>
                <Button onClick={handleCopyLink} size={'icon-sm'}>
                    <Check
                        className={cn(
                            'absolute transition-opacity duration-400 opacity-0',
                            isConfirmed && 'opacity-100'
                        )}
                    />
                    <LinkIcon
                        className={cn(
                            'absolute transition-opacity duration-400 opacity-100',
                            isConfirmed && 'opacity-0'
                        )}
                    />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={2}>
                Copiar link.
            </TooltipContent>
        </Tooltip>
    );
}
