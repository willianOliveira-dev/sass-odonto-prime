'use client';
import Link from 'next/link';
import clsx from 'clsx';
import logo from '../../../../../public/logo-odonto.png';
import logoTooth from '../../../../../public/logo-tooth.png';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ButtonToggleThemes } from '@/components/ui/buttonToggleThemes';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Banknote,
    CalendarCheck2,
    ChevronsUpDown,
    Folder,
    List,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightOpen,
    User,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useToggleThemes } from '@/hooks/useToggleThemes';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function SidebarLink({
    href,
    label,
    icon,
    pathname,
    isCollapsed = true,
    onClick,
}: SidebarLinkProps) {
    return (
        <Button
            onClick={() => onClick && onClick()}
            asChild
            className={clsx(
                'w-full flex items-center px-3 py-2 gap-2transition-colors',
                {
                    ' text-white  bg-blue-600  hover:bg-blue-500':
                        pathname === href,
                    ' text-gray-700 dark:text-gray-400 bg-transparent':
                        pathname !== href,
                    'justify-center': isCollapsed,
                    'justify-start': !isCollapsed,
                }
            )}
            variant={pathname === href ? 'default' : 'ghost'}
            size={`${isCollapsed ? 'icon' : 'default'}`}
        >
            <Link href={href}>
                {icon} {!isCollapsed && <span>{label}</span>}
            </Link>
        </Button>
    );
}

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
    const [isScroll, setIsScroll] = useState<boolean>(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { isDarkMode, toggleThemes } = useToggleThemes();
    const pathname = usePathname();
    const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
    const [isOpenDashboard, setIsOpenDashboard] = useState<boolean>(true);
    const [isOpenMyAccount, setIsOpenMyAccount] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen w-full">
            <aside
                className={clsx(
                    'hidden md:flex fixed top-0 bottom-0 flex-col bg-background border-r transition-all p-4 z-[10]',
                    {
                        'w-20': isCollapsed,
                        'w-64': !isCollapsed,
                    }
                )}
            >
                <div className="flex justify-center mb-6 mt-4">
                    {!isCollapsed ? (
                        <Image
                            src={logo}
                            alt="Logo OdontoPro"
                            priority
                            quality={75}
                            className="w-[150px]"
                        />
                    ) : (
                        <Image
                            src={logoTooth}
                            alt="Logo OdontoPro"
                            priority
                            quality={75}
                            className="w-[30px]"
                        />
                    )}
                </div>

                <Button
                    className={clsx('mb-4 cursor-pointer', {
                        'self-end': !isCollapsed,
                        'self-center': isCollapsed,
                    })}
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen className="w-12 h-12" />
                    ) : (
                        <PanelLeftClose className="w-12 h-12" />
                    )}
                </Button>

                <div className="flex flex-col gap-1">
                    {!isCollapsed ? (
                        <>
                            <Collapsible
                                open={isOpenDashboard}
                                onOpenChange={setIsOpenDashboard}
                            >
                                <CollapsibleTrigger className="w-full p-2 flex items-center justify-between text-sm text-gray-400 font-medium mt-1 uppercase ">
                                    <span>Dashboard</span>{' '}
                                    <ChevronsUpDown className="w-4 h-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <nav className="flex flex-col gap-2 overflow-hidden">
                                        <SidebarLink
                                            href="/dashboard"
                                            label="Agendamentos"
                                            pathname={pathname}
                                            isCollapsed={isCollapsed}
                                            icon={
                                                <CalendarCheck2 className="w-6 h-6" />
                                            }
                                        />
                                        <SidebarLink
                                            href="/dashboard/services"
                                            label="Serviços"
                                            pathname={pathname}
                                            isCollapsed={isCollapsed}
                                            icon={
                                                <Folder className="w-6 h-6" />
                                            }
                                        />
                                    </nav>
                                </CollapsibleContent>
                            </Collapsible>
                            <Collapsible
                                open={isOpenMyAccount}
                                onOpenChange={setIsOpenMyAccount}
                            >
                                <CollapsibleTrigger className="w-full p-2 flex items-center justify-between text-sm text-gray-400 font-medium mt-1 uppercase">
                                    <span>Minha Conta</span>{' '}
                                    <ChevronsUpDown className="w-4 h-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <nav className="flex flex-col gap-2 overflow-hidden">
                                        <SidebarLink
                                            href="/dashboard/profile"
                                            label="Meu perfil"
                                            pathname={pathname}
                                            isCollapsed={isCollapsed}
                                            icon={<User className="w-6 h-6" />}
                                        />
                                        <SidebarLink
                                            href="/dashboard/plans"
                                            label="Planos"
                                            pathname={pathname}
                                            isCollapsed={isCollapsed}
                                            icon={
                                                <Banknote className="w-6 h-6" />
                                            }
                                        />
                                    </nav>
                                </CollapsibleContent>
                            </Collapsible>
                        </>
                    ) : (
                        <nav className="grid text-base pt-5 gap-2">
                            {/* Agendamentos */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <SidebarLink
                                        href="/dashboard"
                                        label="Agendamentos"
                                        pathname={pathname}
                                        icon={
                                            <CalendarCheck2 className="w-6 h-6" />
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Agendamentos</p>
                                </TooltipContent>
                            </Tooltip>
                            {/* Serviços */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <SidebarLink
                                        href="/dashboard/services"
                                        label="Serviços"
                                        pathname={pathname}
                                        icon={<Folder className="w-6 h-6" />}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Serviços</p>
                                </TooltipContent>
                            </Tooltip>
                            {/* Meu perfil */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <SidebarLink
                                        href="/dashboard/profile"
                                        label="Meu perfil"
                                        pathname={pathname}
                                        icon={<User className="w-6 h-6" />}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Meu perfil</p>
                                </TooltipContent>
                            </Tooltip>
                            {/* Planos */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <SidebarLink
                                        href="/dashboard/plans"
                                        label="Planos"
                                        pathname={pathname}
                                        icon={<Banknote className="w-6 h-6" />}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Planos</p>
                                </TooltipContent>
                            </Tooltip>
                        </nav>
                    )}
                </div>
            </aside>
            <div
                className={clsx(
                    'flex flex-1 flex-col transition-all duration-300',
                    {
                        'md:ml-20': isCollapsed,
                        'md:ml-64': !isCollapsed,
                    }
                )}
            >
                <header
                    className={clsx(
                        'md:hidden sticky top-0 flex items-center justify-between shadow-sm px-4 h-14 z-10 dark:shadow-black',
                        {
                            ' bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-lg':
                                isScroll,
                            ' bg-white dark:bg-[#0a0a0a]': !isScroll,
                        }
                    )}
                >
                    <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
                        <div className="flex items-center gap-4">
                            <SheetTrigger
                                asChild
                                onClick={() => setIsCollapsed(false)}
                            >
                                <Button
                                    variant="outline"
                                    size={'icon'}
                                    className="md:hidden cursor-pointer"
                                >
                                    <List className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <h1 className="text-base md:text-lg font-semibold">
                                Menu OdontoPrime
                            </h1>
                        </div>
                        <ButtonToggleThemes
                            isDarkMode={isDarkMode}
                            toggleThemes={toggleThemes}
                        />
                        <SheetContent
                            side="left"
                            className="sm:max-w-xs p-5 sm:p-7"
                        >
                            <SheetTitle>OdontoPrime</SheetTitle>
                            <SheetDescription>
                                Menu administrativo
                            </SheetDescription>

                            <nav className="grid text-base pt-5 gap-2">
                                <SidebarLink
                                    href="/dashboard"
                                    label="Agendamentos"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                    onClick={() => setIsOpenSheet(false)}
                                    icon={
                                        <CalendarCheck2 className="w-6 h-6" />
                                    }
                                />
                                <SidebarLink
                                    href="/dashboard/services"
                                    label="Serviços"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                    onClick={() => setIsOpenSheet(false)}
                                    icon={<Folder className="w-6 h-6" />}
                                />
                                <SidebarLink
                                    href="/dashboard/profile"
                                    label="Meu perfil"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                    onClick={() => setIsOpenSheet(false)}
                                    icon={<User className="w-6 h-6" />}
                                />
                                <SidebarLink
                                    href="/dashboard/plans"
                                    label="Planos"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                    onClick={() => setIsOpenSheet(false)}
                                    icon={<Banknote className="w-6 h-6" />}
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 py-6 px-4">{children}</main>
            </div>
        </div>
    );
}

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    pathname: string;
    isCollapsed?: boolean;
    onClick?: () => void;
}
