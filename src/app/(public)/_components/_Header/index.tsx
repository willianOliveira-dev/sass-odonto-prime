'use client';
import Link from 'next/link';
import logo from '../../../../../public/logo-odonto.png';
import Image from 'next/image';
import { useToggleThemes } from '@/hooks/useToggleThemes';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { LogIn, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';
import { ButtonToggleThemes } from '@/components/ui/buttonToggleThemes';
import clsx from 'clsx';

export function Header() {
    const [isScroll, setIsScroll] = useState<boolean>(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const { isDarkMode, toggleThemes } = useToggleThemes();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data: session, status } = useSession();

    const navItems = [{ href: '#profissionais', label: 'Profissionais' }];

    const NavLinks = () => (
        <>
            {navItems.map((link) => (
                <Button
                    onClick={() => setIsOpen(false)}
                    asChild
                    className="bg-transparent hover:bg-gray-100 text-black shadow-none duration-300 dark:text-white dark:hover:bg-zinc-800"
                    key={link.href}
                >
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}

            {status === 'loading' ? (
                <LoaderSpinner size="md" />
            ) : session ? (
                <Button
                    asChild
                    className="text-white hover:bg-zinc-700 shadow-none duration-300 dark:text-white dark:hover:bg-zinc-800  dark:bg-[#171717]"
                >
                    <Link href={'/dashboard'}>Acessar Clínica</Link>
                </Button>
            ) : (
                <Button
                    asChild
                    className="text-white hover:bg-zinc-700 shadow-none duration-300 dark:text-white dark:hover:bg-zinc-800 dark:bg-[#171717]"
                >
                    <Link href={'/login'}>
                        <LogIn />
                        <span>Login</span>
                    </Link>
                </Button>
            )}
        </>
    );

    return (
        <header
            className={clsx(
                'fixed top-0 left-0 right-0 z-[999] py-4 px-6 shadow-sm dark:shadow-black',
                {
                    ' bg-white/90 dark:bg-[#0a0a0a]/90 dark:shadow-black backdrop-blur-lg':
                        isScroll,
                    ' bg-white dark:bg-[#0a0a0a] dark:shadow-black': !isScroll,
                }
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link className="font-bold text-3xl text-zinc-900" href={'/'}>
                    <Image
                        src={logo}
                        alt="Logo OdontoPro"
                        priority
                        quality={75}
                        className="w-[100px] min-w-[100px] md:w-[125px]"
                    />
                </Link>
                <nav className="hidden md:flex items-center space-x-4">
                    <NavLinks />
                    <ButtonToggleThemes
                        isDarkMode={isDarkMode}
                        toggleThemes={toggleThemes}
                    />
                </nav>

                <div className="md:hidden flex items-center gap-4">
                    <ButtonToggleThemes
                        isDarkMode={isDarkMode}
                        toggleThemes={toggleThemes}
                    />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger
                            asChild
                            className="text-black hover:bg-transparent dark:text-white"
                        >
                            <Button variant={'ghost'} size={'icon'}>
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[240px] sm:w-[300px] z-[9999]"
                        >
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription>
                                    Veja nossos Links
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col space-y-4 mt-2">
                                <NavLinks />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
