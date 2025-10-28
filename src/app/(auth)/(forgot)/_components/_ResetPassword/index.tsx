"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    useResetPasswordForm,
    ResetPasswordFormProps,
} from "../../_hooks/useResetPasswordForm";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { Eye, EyeClosed } from "lucide-react";

interface ResetPasswordProps {
    email: string;
}

export function ResetPassword({ email }: ResetPasswordProps) {
    const [openEye, setOpenEye] = useState<boolean>(false);
    const [isRedefining, setIsRedefining] = useState<boolean>(false);
    const form = useResetPasswordForm();
    const router = useRouter();
    const handleResetPassword = async ({
        password,
        confirmPassword: _,
    }: ResetPasswordFormProps) => {
        setIsRedefining(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/forgot/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        newPassword: password,
                    }),
                },
            );

            const data = await res.json();
            setIsRedefining(false);
            if (data.error) {
                toast.error("Erro de redefinição de senha:", {
                    description: data.error,
                    richColors: true,
                    position: "top-center",
                    duration: 5000,
                });
                return;
            }

            toast.success("Sua senha foi alterada com sucesso!");
            router.push("/login");
        } catch (error) {
            console.log(error);
            toast.error("Falha ao redefinir senha.");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleResetPassword)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={openEye ? "text" : "password"}
                                    placeholder="Deve ter no mínimo 8 caracteres"
                                />
                                {openEye ? (
                                    <Eye
                                        onClick={() => setOpenEye(!openEye)}
                                        className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                                    />
                                ) : (
                                    <EyeClosed
                                        onClick={() => setOpenEye(!openEye)}
                                        className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                                    />
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirme sua senha</FormLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={openEye ? "text" : "password"}
                                    placeholder="Deve ter no mínimo 8 caracteres"
                                />
                                {openEye ? (
                                    <Eye
                                        onClick={() => setOpenEye(!openEye)}
                                        className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                                    />
                                ) : (
                                    <EyeClosed
                                        onClick={() => setOpenEye(!openEye)}
                                        className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                                    />
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className=" w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 cursor-pointer hover:scale-101"
                >
                    {isRedefining ? (
                        <>
                            <LoaderSpinner size="sm" />
                            atualizando...
                        </>
                    ) : (
                        "  Redefinir sua senha"
                    )}
                </Button>
            </form>
        </Form>
    );
}
