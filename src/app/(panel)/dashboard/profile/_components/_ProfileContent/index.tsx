"use client";
import clsx from "clsx";
import Image from "next/image";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { JSX, useState } from "react";
import { Check, ChevronsUpDown, LogOut } from "lucide-react";
import { ProfileFormData, useProfileForm } from "../../_hook/useProfileForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { updateProfile } from "../../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone } from "@/helpers/formatPhone";
import { useLinkedProvider } from "../../_hook/useLinkedProvider";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Prisma } from "@prisma/client";
import { AvatarProfile } from "../_AvatarProfile";

const BRAZILTIMESZONE = [
    { label: "America/Sao_Paulo", value: "America/Sao_Paulo" },
    { label: "America/Rio_Branco", value: "America/Rio_Branco" },
    { label: "America/Recife", value: "America/Recife" },
    { label: "America/Fortaleza", value: "America/Fortaleza" },
    { label: "America/Bahia", value: "America/Bahia" },
    { label: "America/Belem", value: "America/Belem" },
    { label: "America/Manaus", value: "America/Manaus" },
    { label: "America/Boa_Vista", value: "America/Boa_Vista" },
    { label: "America/Porto_Velho", value: "America/Porto_Velho" },
    { label: "America/Cuiaba", value: "America/Cuiaba" },
    {
        label: "America/Campo_Grande",
        value: "America/Campo_Grande",
    },
    { label: "America/Araguaina", value: "America/Araguaina" },
    { label: "America/Eirunepe", value: "America/Eirunepe" },
    { label: "America/Noronha", value: "America/Noronha" },
];

const PROVIDERS_ICONS_MAPPING: Record<string, JSX.Element> = {
    google: <FaGoogle className="w-4 h-4 min-w-4" />,
    facebook: <FaFacebook className=" w-4 h-4 min-w-4" />,
};

type UserWithSubscription = Omit<
    Prisma.UserGetPayload<{
        include: {
            subscription: true;
        };
    }> & {
        hasPassword: boolean;
    },
    "password"
>;

interface ProfileContentProps {
    user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectHours, setSelectHours] = useState<string[]>(user?.times ?? []);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingExit, setLoadingExit] = useState<boolean>(false);
    const { update } = useSession();
    const { isLinked, provider } = useLinkedProvider();
    const router = useRouter();

    const form = useProfileForm({
        name: user?.name,
        email: user?.email,
        address: user?.address,
        phone: user?.phone,
        status: user?.status ? "active" : "inactive",
        timezone: user?.timezone,
    });

    const generateTimeSlots = (): string[] => {
        const hours: string[] = [];

        for (let h = 8; h <= 24; h++) {
            for (let m = 0; m < 2; m++) {
                let hour = h.toString().padStart(2, "0");
                let minute = (m * 30).toString().padStart(2, "0");
                hours.push(`${hour}:${minute}`);
            }
        }
        return hours;
    };

    const toggleHour = (hour: string) => {
        setSelectHours((prev) =>
            prev.includes(hour)
                ? prev.filter((h) => h !== hour)
                : [...prev, hour].sort(),
        );
    };

    const handleLogout = async () => {
        setLoadingExit(true);
        await signOut();
        await update();
        setLoadingExit(false);
        router.replace("/");
    };

    const onSubmit = async (values: ProfileFormData) => {
        setLoading(true);
        const res = await updateProfile({
            name: values.name,
            email: isLinked ? user?.email! : values.email,
            status: values.status === "active" ? true : false,
            address: values.address,
            timezone: values.timezone,
            phone: values.phone,
            times: selectHours || [],
        });

        setLoading(false);

        if (res.error) {
            toast.error("Erro ao atualizar perfil:", {
                richColors: true,
                description: res.error,
            });
            return;
        }

        toast.success(res.data, {
            description: `Atualizado em ${Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).format(user?.updatedAt)}`,
        });
    };

    return (
        <section>
            <div className="container mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Meu Perfil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    <AvatarProfile
                                        avatarUrl={user?.image}
                                        alt={`Imagem de ${user?.name}`}
                                        userId={user?.id}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Nome Completo
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
                                                        placeholder="Ex: Clínica Vida & Saúde"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-gray-400">
                                                    Digite o nome completo da
                                                    clínica.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        disabled={isLinked}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Email
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
                                                        type="email"
                                                        placeholder="m@example.com"
                                                    />
                                                </FormControl>
                                                <FormDescription
                                                    className={cn(
                                                        "text-gray-400",
                                                        isLinked &&
                                                            "flex items-center gap-2",
                                                    )}
                                                >
                                                    {!!provider ? (
                                                        <>
                                                            {
                                                                PROVIDERS_ICONS_MAPPING[
                                                                    provider
                                                                ]
                                                            }
                                                            <span>
                                                                O email está
                                                                vinculado a uma
                                                                conta externa e
                                                                não pode ser
                                                                alterado.
                                                            </span>
                                                        </>
                                                    ) : (
                                                        "Digite o email da clínica, que será usado para login e comunicação."
                                                    )}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Endereço Completo
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Ex: Av. Sol Nascente, 456 – Nova Esperança, SP – 12345-678"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-gray-400">
                                                    Informe o endereço completo
                                                    da clínica, incluindo rua,
                                                    número, bairro, cidade e
                                                    estado.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Telefone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        placeholder="Ex: (21) 98765-4321"
                                                        onChange={(e) => {
                                                            const formattedValue =
                                                                formatPhone(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            field.onChange(
                                                                formattedValue,
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-gray-400">
                                                    Insira o número de telefone
                                                    da clínica, com DDD.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Status{" "}
                                                    <span
                                                        className="text-red-600 ml-1"
                                                        title="Campo obrigatório"
                                                        aria-label="Campo obrigatório"
                                                    >
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione o status da clinica" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">
                                                                ATIVO (clínica
                                                                aberta)
                                                            </SelectItem>
                                                            <SelectItem value="inactive">
                                                                INATIVO (clínica
                                                                fechada)
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription className="text-gray-400">
                                                    Escolha se a clínica está
                                                    "Aberta" ou "Fechada".
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <Label className="font-semibold">
                                            Configurar horários da clinica
                                        </Label>

                                        <Dialog
                                            open={openModal}
                                            onOpenChange={setOpenModal}
                                        >
                                            <DialogTrigger
                                                asChild
                                                className="w-full justify-between bg-gray-500 font-normal cursor-pointer"
                                            >
                                                <Button>
                                                    <span>
                                                        Clique aqui para
                                                        selecionar horários
                                                    </span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Horários da clínica
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Selecione abaixo os
                                                        horários de
                                                        funcionamento da
                                                        clínica:
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {generateTimeSlots().map(
                                                        (hour, idx) => (
                                                            <Button
                                                                onClick={() =>
                                                                    toggleHour(
                                                                        hour,
                                                                    )
                                                                }
                                                                key={idx}
                                                                variant={
                                                                    "outline"
                                                                }
                                                                className={clsx(
                                                                    "ring-2 ring-gray-300/40 cursor-pointer",
                                                                    {
                                                                        "ring-emerald-400":
                                                                            selectHours.includes(
                                                                                hour,
                                                                            ),
                                                                    },
                                                                )}
                                                            >
                                                                {hour}
                                                            </Button>
                                                        ),
                                                    )}
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        setOpenModal(false)
                                                    }
                                                    className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                                                >
                                                    Fechar horários
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="timezone"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="font-semibold">
                                                    Fuso horário{" "}
                                                    <span
                                                        className="text-red-600 ml-1"
                                                        title="Campo obrigatório"
                                                        aria-label="Campo obrigatório"
                                                    >
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <Popover modal>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between cursor-pointer",
                                                                    !field.value &&
                                                                        "text-muted-foreground",
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? BRAZILTIMESZONE.find(
                                                                          (
                                                                              zone,
                                                                          ) =>
                                                                              zone.value ===
                                                                              field.value,
                                                                      )?.label
                                                                    : "Seu fuso horário"}
                                                                <ChevronsUpDown className="opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] md:w-[400px] p-0 ">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Buscar Fuso horário..."
                                                                className="h-9"
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    Fuso horário
                                                                    não
                                                                    encontrado.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {BRAZILTIMESZONE.map(
                                                                        (
                                                                            zone,
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    zone.label
                                                                                }
                                                                                key={
                                                                                    zone.value
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "timezone",
                                                                                        zone.value,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    zone.label
                                                                                }
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        zone.value ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0",
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ),
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription className="text-gray-400">
                                                    Este fuso horário que será
                                                    utilizado na clínica.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderSpinner />{" "}
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            "Salvar alterações"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>

                <Button
                    className="mt-4 cursor-pointer"
                    onClick={() => handleLogout()}
                >
                    <LogOut className="w-5 h-5" />
                    <span> {loadingExit ? "Saindo..." : "Sair da Conta"}</span>
                </Button>
            </div>
        </section>
    );
}
