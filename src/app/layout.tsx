'use client';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Roboto } from 'next/font/google';
import { QueryClientContext } from '@/providers/QueryClientContext';
import { SessionAuthProvider } from '@/components/session-auth';
import './globals.css';

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add(savedTheme);
        } else {
            document.documentElement.classList.remove(savedTheme!);
        }
    }, []);

    return (
        <html lang="pt-BR">
            <body className={`${roboto.className} antialiased`}>
                <SessionAuthProvider>
                    <QueryClientContext>
                        <Toaster closeButton />
                        {children}
                    </QueryClientContext>
                </SessionAuthProvider>
            </body>
        </html>
    );
}
