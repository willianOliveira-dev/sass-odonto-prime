"use client";
import { useEffect, useState } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { ResetPassword } from "../_ResetPassword";

interface ForgotVerifyProps {
    email: string;
}

export function ForgotVerify({ email }: ForgotVerifyProps) {
    const [code, setCode] = useState<string>("");
    const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
    const [isCodeConfirmed, setIsCodeConfirmed] = useState<boolean>(false);
    const [candResend, setCandResend] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const startTimer = () => {
        setTimeLeft(60);
        setCandResend(true);
        const id = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    setCandResend(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return id;
    };

    useEffect(() => {
        const referenceInterval = startTimer();
        return () => clearInterval(referenceInterval);
    }, []);

    const handleVerificationCode = async () => {
        setIsSendingCode(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/forgot/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        code,
                    }),
                },
            );

            const data = await res.json();

            setIsSendingCode(false);

            if (data.error) {
                toast.error("Erro de verificação:", {
                    description: data.error,
                    richColors: true,
                    position: "top-center",
                    duration: 5000,
                });
                return;
            }

            setIsCodeConfirmed((prev) => !prev);
        } catch (error) {
            console.log(error);
            toast.error("Falha ao verificar e-mail.");
        }
    };

    const handleResend = async () => {
        toast("Estamos enviando o seu código...");

        setCandResend(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/forgot/resend`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                },
            );
            const data = await res.json();

            if (data.error) {
                toast.error("Erro de reenvio:", {
                    description: data.error,
                    richColors: true,
                    position: "top-center",
                    duration: 5000,
                });
                return;
            }

            startTimer();
            toast.success("Código reenviado.");
        } catch (error) {
            console.log(error);
            toast.error("Falha ao reenviar código.");
        }
    };

    return (
        <>
            {isCodeConfirmed ? (
                <ResetPassword email={email} />
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <p className="font-medium">
                            Insira o código enviado para
                        </p>
                        <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <InputOTP
                            maxLength={6}
                            minLength={6}
                            value={code}
                            onChange={(value) => {
                                setCode(value.toUpperCase());
                            }}
                        >
                            <InputOTPGroup className="space-x-1.5">
                                <InputOTPSlot
                                    index={0}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                                <InputOTPSlot
                                    index={1}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                                <InputOTPSlot
                                    index={2}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                                <InputOTPSlot
                                    index={3}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                                <InputOTPSlot
                                    index={4}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                                <InputOTPSlot
                                    index={5}
                                    className="w-9 h-12 sm:w-12 sm:h-15 border-2 text-lg font-medium"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            disabled={candResend}
                            onClick={handleResend}
                            variant="ghost"
                            className="relative w-fit group h-fit py-0.5 px-0 cursor-pointer font-bold  text-blue-500 hover:bg-transparent hover:text-blue-500"
                        >
                            Enviar novamente
                            <span className="absolute bottom-0 w-0 group-hover:w-full h-0.5 bg-blue-500 transition-all duration-200"></span>
                        </Button>

                        {candResend && (
                            <span className="text-xs text-gray-400">
                                Aguarde {timeLeft} s
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleVerificationCode}
                        disabled={isSendingCode || code.length !== 6}
                        className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 cursor-pointer hover:scale-101"
                    >
                        {isSendingCode ? (
                            <>
                                <LoaderSpinner size="sm" />
                                Verificando...
                            </>
                        ) : (
                            "Redefinir senha"
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
