"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../public/logo-odonto.png";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ForgotFormProps,
    useForgotForm,
} from "@/app/(auth)/(forgot)/_hooks/useForgotForm";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ForgotForm } from "../_components/_ForgotForm";
import { ForgotVerify } from "../_components/_ForgotVerify";

export default function ForgotPage() {
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);

    const form = useForgotForm();

    const handleVerificationEmail = async ({ email }: ForgotFormProps) => {
        setIsSendingEmail(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/forgot`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await res.json();

            setIsSendingEmail(false);

            if (data.error) {
                toast.error("Error de verificação:", {
                    description: data.error,
                    richColors: true,
                    position: "top-center",
                    duration: 5000,
                });
                return;
            }

            setIsEmailConfirmed((prev) => !prev);
        } catch (error) {
            console.log(error);
            toast.error("Falha ao verificar e-mail.");
        }
    };

    return (
        <main className="px-4">
            <section className="flex items-center justify-center min-h-screen">
                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center sm:text-start">
                            Esqueci minha senha
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3.5">
                            {isEmailConfirmed ? (
                                <ForgotVerify email={form.watch("email")} />
                            ) : (
                                <ForgotForm
                                    form={form}
                                    handleVerificationEmail={form.handleSubmit(
                                        handleVerificationEmail,
                                    )}
                                    isSendingEmail={isSendingEmail}
                                />
                            )}

                            <Button
                                className="w-full group"
                                variant="ghost"
                                asChild
                            >
                                <Link href="/login">
                                    <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform duration-300" />
                                    <span>Voltar para login</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="w-full flex items-center justify-center">
                        <Image
                            src={logo}
                            alt="Logo OdontoPrime"
                            className="object-contain w-[90px] grayscale opacity-35"
                            priority
                        />
                    </CardFooter>
                </Card>
            </section>
        </main>
    );
}
