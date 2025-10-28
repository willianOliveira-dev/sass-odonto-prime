"use client";
import Image from "next/image";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "../../../../../../public/logo-odonto.png";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useState, useEffect } from "react";
import { Mail, RefreshCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VerifyContentProps {
    userId: string;
    email: string;
}

export function VerifyContent({ userId, email }: VerifyContentProps) {
    const { update } = useSession();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();

    const startTimer = () => {
        setTimeLeft(60);
        setCanResend(false);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        const sendInitialCode = async () => {
            setMessage("");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/resend`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, email }),
                },
            );

            const data = await res.json();
            setLoading(false);
            setMessage(
                data.success ? "Código enviado para seu e-mail!" : data.error,
            );

            if (data.success) {
                startTimer();
            }
        };

        sendInitialCode();
    }, []);

    const handleVerify = async () => {
        setMessage("");
        setLoading(true);
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/auth/verify`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, code }),
            },
        );

        const data = await res.json();
        setLoading(false);
        setMessage(data.success ? "Verificado com sucesso!" : data.error);

        if (data.success) {
            await update(); // Força a NextAuth a recarregar a sessão

            router.push("/dashboard");
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setMessage("");
        setLoading(true);
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/auth/resend`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, email }),
            },
        );

        const data = await res.json();

        setLoading(false);
        setMessage(data.success ? "Código reenviado!" : data.error);

        if (data.success) {
            startTimer();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <main className="min-h-screen px-4 py-8">
            <section className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full sm:max-w-md border shadow-sm rounded-2xl">
                    <CardHeader className="text-center space-y-3 pb-6">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                            <Mail className="text-gray-400 w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl font-semibold">
                            Verifique seu e-mail
                        </CardTitle>
                        <p className="text-gray-400">
                            Digite o código de 6 dígitos enviado
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                minLength={6}
                                value={code}
                                onChange={(value) => {
                                    setCode(value.toUpperCase());
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        index={0}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                    <InputOTPSlot
                                        index={1}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                    <InputOTPSlot
                                        index={2}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        index={3}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                    <InputOTPSlot
                                        index={4}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                    <InputOTPSlot
                                        index={5}
                                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 text-lg font-medium"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                disabled={loading}
                                onClick={handleVerify}
                                className={cn(
                                    "w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors",
                                    loading && " cursor-not-allowed ",
                                )}
                            >
                                Verificar código
                            </Button>

                            <Button
                                onClick={handleResend}
                                variant={"outline"}
                                disabled={!canResend}
                                className={cn(
                                    "w-full py-3 font-medium rounded-lg transition-colors ",
                                    !canResend &&
                                        "text-gray-400 cursor-not-allowed border border-gray-200",
                                )}
                            >
                                <RefreshCcw /> Reenviar código
                            </Button>
                        </div>

                        {message && (
                            <div className="p-3 rounded-lg text-center text-sm font-medium bg-gray-200 text-black">
                                {message}
                            </div>
                        )}

                        {loading && <LoadingDots />}

                        <p
                            className={cn(
                                "text-sm text-center text-gray-500",
                                !canResend &&
                                    "flex items-center justify-center gap-0.5",
                            )}
                        >
                            {canResend ? (
                                "Código expirado"
                            ) : (
                                <>
                                    Código expira em {formatTime(timeLeft)}{" "}
                                    <Timer className="w-5. h-4.5" />
                                </>
                            )}
                        </p>
                    </CardContent>

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
