'use client';
import { useState } from 'react';
import { AlertDeleteService } from '../AlertDeleteService';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { DialogService } from '../_DialogService';
import { Clock, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertMinutesToHours } from '@/helpers/convertMinutesToHours';
import { formatCurrency } from '@/helpers/formatCurrency';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { deleteService } from '../../_actions/deleteService';
import { type Service } from '@prisma/client';
import { type ResultPermissionProps } from '@/helpers/plans/permissions/canPermissions';
import Link from 'next/link';

interface ServicesListProps {
    services: Service[];
    permission: ResultPermissionProps;
}

export function ServicesList({ services, permission }: ServicesListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const serviceList = permission.hasPermission
        ? services
        : services.slice(0, permission.plan?.maxServices);

    const handleDeleteService = async (serviceId: string) => {
        setLoading(true);

        const res = await deleteService({ serviceId });

        setLoading(false);

        if (res.error) {
            toast.error('Erro ao adicionar serviço:', {
                duration: 5000,
                position: 'bottom-right',
                richColors: true,
                description: res.error,
            });
            return;
        }

        toast.success(res.data, {
            duration: 5000,
            position: 'bottom-right',
        });
        return;
    };

    const handleEditService = async (service: Service) => {
        setEditingService(service);
        setIsDialogOpen(true);
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setEditingService(null);
                }
                setIsDialogOpen(open);
            }}
        >
            <section className="mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1.5">
                            <CardTitle className="text-xl md:text-2xl">
                                Serviços
                            </CardTitle>
                            <CardDescription>Lista de Serviços</CardDescription>
                        </div>
                        {permission.hasPermission ? (
                            <DialogTrigger asChild>
                                <Button
                                    disabled={!permission.hasPermission}
                                    className="cursor-pointer"
                                    variant={'default'}
                                    size={'icon'}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                        ) : (
                            <Button asChild variant={'destructive'}>
                                <Link href={'/dashboard/plans'}>
                                    Limite de serviços atingido
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Desktop */}
                        <section className="hidden md:block w-full overflow-x-auto">
                            <Table className="table-fixed">
                                <TableCaption>
                                    Controles de Serviços
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">
                                            Serviço
                                        </TableHead>
                                        <TableHead className="w-[400px]">
                                            Descrição
                                        </TableHead>
                                        <TableHead className="w-[100px]">
                                            Duração
                                        </TableHead>
                                        <TableHead className="w-[150px] text-right">
                                            Orçamento
                                        </TableHead>
                                        <TableHead className="w-[100px] text-right">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {serviceList.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="truncate max-w-[200px]">
                                                {service.name}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'truncate max-w-[400px]',
                                                    !service.description &&
                                                        'text-gray-400'
                                                )}
                                            >
                                                {service.description ||
                                                    'Sem descrição disponível.'}
                                            </TableCell>
                                            <TableCell className="text-start whitespace-nowrap">
                                                {convertMinutesToHours(
                                                    service.duration
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                {formatCurrency(
                                                    service.price / 100
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end items-center gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            handleEditService(
                                                                service
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                                        size={'icon'}
                                                        variant={'default'}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                    <AlertDeleteService
                                                        service={service.name}
                                                        loading={loading}
                                                        onDelete={() =>
                                                            handleDeleteService(
                                                                service.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </section>
                        {/* Mobile */}
                        <section className="md:hidden space-y-6">
                            {serviceList.map((service) => (
                                <article key={service.id}>
                                    <Card>
                                        <CardContent className="flex flex-col gap-4">
                                            <span className="font-semibold">
                                                {service.name}
                                            </span>
                                            <span
                                                className={cn(
                                                    !service.description &&
                                                        'rounded-sm bg-gray-200 dark:bg-zinc-800 p-2'
                                                )}
                                            >
                                                {service.description ||
                                                    ' Sem descrição disponível.'}
                                            </span>
                                            <div className="flex flex-row items-center gap-2 text-gray-500 dark:text-gray-300">
                                                <span>
                                                    {formatCurrency(
                                                        service.price / 100
                                                    )}
                                                </span>
                                                <span>-</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />{' '}
                                                    {convertMinutesToHours(
                                                        service.duration
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-center justify-end">
                                                <Button
                                                    onClick={() =>
                                                        handleEditService(
                                                            service
                                                        )
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                                    size={'icon'}
                                                    variant={'default'}
                                                >
                                                    <Pencil />
                                                </Button>
                                                <AlertDeleteService
                                                    service={service.name}
                                                    loading={loading}
                                                    onDelete={() =>
                                                        handleDeleteService(
                                                            service.id
                                                        )
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingService
                                    ? 'Editar Serviço'
                                    : 'Novo Serviço'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingService
                                    ? 'Atualize os detalhes do serviço.'
                                    : 'Adicione um novo serviço.'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogService
                            onClose={() => {
                                setIsDialogOpen(false);
                                setEditingService(null);
                            }}
                            serviceId={
                                editingService ? editingService.id : undefined
                            }
                            initialValues={
                                editingService
                                    ? {
                                          name: editingService.name,
                                          description:
                                              editingService.description || '',
                                          price: (editingService.price / 100)
                                              .toFixed(2)
                                              .replace('.', ','),
                                          hours: String(
                                              Math.floor(
                                                  editingService.duration / 60
                                              )
                                          ),
                                          minutes: String(
                                              editingService.duration % 60
                                          ),
                                      }
                                    : undefined
                            }
                        />
                    </DialogContent>
                </Card>
            </section>
        </Dialog>
    );
}
