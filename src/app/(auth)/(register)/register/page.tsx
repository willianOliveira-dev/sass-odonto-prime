"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../public/logo-odonto.png";
import { signIn } from "next-auth/react";
import { Check, CircleX, Eye, EyeClosed } from "lucide-react";
import {
    useRegisterForm,
    type RegisterFormProps,
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
    const [openEye, setOpenEye] = useState(false);
    const [loading, setLoading] = useState(false);
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
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
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
            toast.error("Erro de autenticação:", {
                description: data.error,
                richColors: true,
                position: "top-center",
                duration: 5000,
            });
        }
    };

    return (
        <main className="px-4 sm:px-6">
            <section className="flex items-center justify-center min-h-screen py-6 sm:py-12">
                <Card className="w-full max-w-md sm:max-w-lg flex flex-col justify-between h-full sm:h-auto">
                    {/* Cabeçalho */}
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl text-center">
                            Registre-se
                        </CardTitle>
                        <CardDescription className="text-center text-sm sm:text-base">
                            Já possui uma conta?
                            <Button
                                asChild
                                variant="link"
                                className="p-1.5 text-xs sm:text-sm"
                            >
                                <Link href="/login">Login</Link>
                            </Button>
                        </CardDescription>
                    </CardHeader>

                    {/* Conteúdo com scroll apenas se necessário */}
                    <CardContent className="flex-1">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4 sm:gap-6"
                            >
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
                                                        placeholder="Digite sua senha"
                                                    />
                                                    {openEye ? (
                                                        <Eye
                                                            onClick={() =>
                                                                setOpenEye(
                                                                    !openEye,
                                                                )
                                                            }
                                                            className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-400 w-5 h-5 cursor-pointer"
                                                        />
                                                    ) : (
                                                        <EyeClosed
                                                            onClick={() =>
                                                                setOpenEye(
                                                                    !openEye,
                                                                )
                                                            }
                                                            className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-400 w-5 h-5 cursor-pointer"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-500">
                                    {[
                                        {
                                            check: validations.hasUppercase,
                                            text: "Pelo menos 1 letra maiúscula (A–Z)",
                                        },
                                        {
                                            check: validations.hasLowercase,
                                            text: "Pelo menos 1 letra minúscula (a–z)",
                                        },
                                        {
                                            check: validations.hasNumber,
                                            text: "Pelo menos 1 número (0–9)",
                                        },
                                        {
                                            check: validations.hasSpecialChar,
                                            text: "Pelo menos 1 símbolo especial (!@#$%^&*)",
                                        },
                                        {
                                            check: validations.hasMinLength,
                                            text: "Mínimo de 8 caracteres",
                                        },
                                    ].map((rule, i) => (
                                        <p
                                            key={i}
                                            className="flex items-center gap-2"
                                        >
                                            {rule.check ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <CircleX className="text-red-500" />
                                            )}
                                            {rule.text}
                                        </p>
                                    ))}
                                </div>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 hover:scale-101 cursor-pointer transition-transform duration-200"
                                >
                                    {loading ? (
                                        <LoaderSpinner size="sm" />
                                    ) : (
                                        "Cadastrar"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    {/* Footer social */}
                    <CardFooter className="flex-col gap-3">
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-[1px] w-full bg-gray-300"></div>
                            <div className="flex-1 text-xs sm:text-sm text-gray-500 text-center text-nowrap">
                                ou registre-se com
                            </div>
                            <div className="h-[1px] w-full bg-gray-300"></div>
                        </div>
                        <div className="flex items-center w-full gap-2">
                            <Button
                                onClick={() => loginActionProvider("facebook")}
                                className="w-1/2 flex items-center gap-1.5 bg-blue-950 rounded-2xl hover:bg-blue-900 text-[11px] sm:text-sm"
                            >
                                <FaFacebook className="w-5 h-5" /> Facebook
                            </Button>
                            <Button
                                onClick={() => loginActionProvider("google")}
                                variant="outline"
                                className="w-1/2 flex items-center gap-1.5 rounded-2xl text-[11px] sm:text-sm"
                            >
                                <FcGoogle className="w-5 h-5" /> Google
                            </Button>
                        </div>
                    </CardFooter>

                    <div className="flex justify-center mt-4 sm:mt-6">
                        <Image
                            src={logo}
                            alt="Logo OdontoPrime"
                            className="object-contain w-20 sm:w-24 grayscale opacity-35"
                            priority
                        />
                    </div>
                </Card>
            </section>
        </main>
    );
}
