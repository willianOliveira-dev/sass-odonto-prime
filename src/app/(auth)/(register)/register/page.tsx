"use client";
import Link from "next/link";
import logo from "../../../../../public/logo-odonto.png";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Check, CircleX, Eye, EyeClosed } from "lucide-react";
import {
    type RegisterFormProps,
    useRegisterForm,
} from "../_hooks/useRegisterForm";
import { toast } from "sonner";
import React, { useState } from "react";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginActionProvider } from "@/app/(auth)/(login)/_actions/loginActionProvider";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const [openEye, setOpenEye] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useRegisterForm();

    const password = form.watch("password");

    const validations = {
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password),
        hasMinLength: password.length >= 8,
    };

    const onSubmit = async (values: RegisterFormProps) => {
        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/auth/register`,
            {
                method: "POST",
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        setLoading(false);

        if (response.ok) {
            await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: true,
                callbackUrl: "/verify",
            });
        } else {
            const data = await response.json();
            toast.error("Error de autenticação:", {
                description: data.error,
                richColors: true,
                position: "top-center",
                duration: 5000,
            });
        }
    };

    return (
        <main className="px-4">
            <section className="flex items-center justify-center min-h-screen">
                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            Registre-se
                        </CardTitle>
                        <CardDescription className="text-center">
                            Já possui uma conta?
                            <Button
                                asChild
                                variant={"link"}
                                className="p-1.5 text-xs"
                            >
                                <Link href={"/login"}>Login</Link>
                            </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    {/* Nome */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Ex: Clínica Vida & Saúde"
                                                        required
                                                        autoComplete="current-password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        required
                                                        autoComplete="current-password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Senha */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            type={
                                                                openEye
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            autoComplete="current-password"
                                                            placeholder="Digite sua senha"
                                                        />
                                                        {openEye ? (
                                                            <Eye
                                                                onClick={() =>
                                                                    setOpenEye(
                                                                        !openEye,
                                                                    )
                                                                }
                                                                className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400 cursor-pointer"
                                                            />
                                                        ) : (
                                                            <EyeClosed
                                                                onClick={() =>
                                                                    setOpenEye(
                                                                        !openEye,
                                                                    )
                                                                }
                                                                className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400 cursor-pointer"
                                                            />
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Regras de senha */}
                                    <div className="flex flex-col gap-0.5">
                                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                                            {validations.hasUppercase ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            Pelo menos 1 letra maiúscula (A–Z)
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                                            {validations.hasLowercase ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            Pelo menos 1 letra minúscula (a–z)
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                                            {validations.hasNumber ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            Pelo menos 1 número (0–9)
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                                            {validations.hasSpecialChar ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            Pelo menos 1 símbolo especial
                                            (!@#$%^&*)
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                                            {validations.hasMinLength ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            Mínimo de 8 caracteres
                                        </p>
                                    </div>

                                    {/* Botão */}
                                    <Button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 cursor-pointer hover:scale-101"
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderSpinner size="sm" />
                                                Entrando...
                                            </>
                                        ) : (
                                            "Cadastrar"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-[1px] w-full bg-gray-300"></div>
                            <div className="flex-1 text-xs text-nowrap text-gray-500">
                                ou registre-se com
                            </div>
                            <div className="h-[1px] w-full bg-gray-300"></div>
                        </div>
                        <div className="flex items-center w-full gap-2">
                            <Button
                                onClick={() => loginActionProvider("facebook")}
                                className="w-1/2 flex items-center gap-1.5 bg-blue-950 rounded-2xl hover:bg-blue-900 text-[11px] dark:text-white"
                            >
                                <FaFacebook className="w-6 h-6 flex-shrink-0 dark:text-white" />{" "}
                                Facebook
                            </Button>
                            <Button
                                onClick={() => loginActionProvider("google")}
                                variant="outline"
                                className="w-1/2 flex items-center gap-1.5 rounded-2xl text-[11px]"
                            >
                                <FcGoogle className="w-6 h-6 flex-shrink-0" />{" "}
                                Google
                            </Button>
                        </div>
                    </CardFooter>
                    <div className="self-center">
                        <Image
                            src={logo}
                            alt="Logo OdontoPrime"
                            className="object-contain w-[90px] grayscale opacity-35"
                            priority
                        />
                    </div>
                </Card>
            </section>
        </main>
    );
}
