'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createNewService } from '../../_actions/createNewService';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    useDialogServiceForm,
    UseDialogServiceFormData,
} from '../../_hook/useServiceForm';
import { Clock, DollarSign, Edit, TextAlignStart } from 'lucide-react';
import { convertRealToCents } from '@/helpers/convertRealToCents';
import { toast } from 'sonner';
import { useState } from 'react';
import { LoaderSpinner } from '@/components/ui/LoaderSpinner';
import { updateService } from '../../_actions/updateService';

interface DialogServiceProps {
    onClose: () => void;
    serviceId?: string;
    initialValues?: UseDialogServiceFormData;
}

interface EditServiceProps {
    serviceId: string;
    values: UseDialogServiceFormData;
}

export function DialogService({
    onClose,
    serviceId,
    initialValues,
}: DialogServiceProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const form = useDialogServiceForm({ initialValues });

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const handleCreateService = async (values: UseDialogServiceFormData) => {
        setLoading(true);

        const hours: number = parseInt(values.hours, 10) || 0;
        const minutes: number = parseInt(values.minutes, 10) || 0;
        const duration: number = hours * 60 + minutes;

        if (serviceId) {
            handleEditService({ serviceId, values });
            setLoading(false);
            return;
        }

        const res = await createNewService({
            name: values.name,
            price: convertRealToCents(values.price),
            description: values.description || '',
            duration,
        });

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

        handleClose();
        return;
    };

    const handleEditService = async ({
        serviceId,
        values,
    }: EditServiceProps) => {
        setLoading(true);
        const hours: number = parseInt(values.hours, 10) || 0;
        const minutes: number = parseInt(values.minutes, 10) || 0;
        const duration: number = hours * 60 + minutes;

        const res = await updateService({
            name: values.name,
            price: convertRealToCents(values.price),
            description: values.description || '',
            duration,
            serviceId,
        });

        setLoading(false);

        if (res.error) {
            toast.error('Erro ao atualizar serviço:', {
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

        handleClose();
        return;
    };

    const changeCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = event.target;

        value = value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        event.target.value = value;
        form.setValue('price', value);
    };

    return (
        <Form {...form}>
            <form
                className="space-y-2"
                onSubmit={form.handleSubmit(
                    serviceId
                        ? () =>
                              handleEditService({
                                  serviceId,
                                  values: form.getValues(),
                              })
                        : handleCreateService
                )}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="my-4">
                            <FormLabel className="text-">
                                Nome
                                <span
                                    className="text-red-600 ml-1"
                                    title="Campo obrigatório"
                                    aria-label="Campo obrigatório"
                                >
                                    *
                                </span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ex: Limpeza Dental"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem className="my-4">
                            <FormLabel>
                                <DollarSign />
                                Valor do Serviço
                                <span
                                    className="text-red-600 ml-1"
                                    title="Campo obrigatório"
                                    aria-label="Campo obrigatório"
                                >
                                    *
                                </span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ex: 150,00"
                                    onChange={changeCurrency}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="my-4">
                            <FormLabel>
                                <TextAlignStart />
                                Descrição
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ex: Limpeza dental com ultrassom, remoção de tártaro, polimento e aplicação de flúor."
                                    className="max-h-56"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <p className="flex gap-2 font-semibold text-sm mt-3 mb-2">
                    <Clock /> Duração do Serviço{' '}
                    <span
                        className="text-red-600 ml-1"
                        title="Campo obrigatório"
                        aria-label="Campo obrigatório"
                    >
                        *
                    </span>
                </p>
                <div className="flex items-center justify-between gap-2 my-3">
                    <FormField
                        control={form.control}
                        name="hours"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="text-gray-400">
                                    Horas:
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        min="0"
                                        max={'23'}
                                        type="number"
                                        placeholder="0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="minutes"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="text-gray-400">
                                    Minutos:
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        min="0"
                                        max={'59'}
                                        type="number"
                                        placeholder="0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    disabled={loading}
                    className="w-full cursor-pointer"
                    type="submit"
                >
                    {loading ? (
                        <>
                            <LoaderSpinner />
                            <span className="ml-2"> Carregando...</span>
                        </>
                    ) : (
                        `${
                            initialValues
                                ? 'Atualizar serviço'
                                : 'Adicionar serviço'
                        }`
                    )}
                </Button>
            </form>
        </Form>
    );
}
