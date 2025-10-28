"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../public/logo-odonto.png";
import { toast } from "sonner";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginActionProvider } from "../_actions/loginActionProvider";
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
import { InputPassword } from "@/components/ui/InputPassword";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    //Transformar o objeto JS em uma String JSON que será enviado no corpo da requisição
                    email,
                    password,
                }),
            },
        );

        const data = await response.json();

        setLoading(false);

        if (data.error) {
            toast.error("Error de autenticação:", {
                description: data.error,
                richColors: true,
                position: "top-center",
                duration: 5000,
            });
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <main className="px-4">
            <section className="flex items-center justify-center min-h-screen">
                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Novo por aqui?
                            <Button
                                asChild
                                variant={"link"}
                                className="p-1.5 text-xs"
                            >
                                <Link href={"/register"}>Registre-se</Link>
                            </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                                {/* Senha */}
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Senha</Label>
                                        <Link
                                            href="/forgot"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Esqueceu sua senha?
                                        </Link>
                                    </div>
                                    <InputPassword
                                        password={password}
                                        setPassword={setPassword}
                                    />
                                </div>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full  bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 cursor-pointer hover:scale-101"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderSpinner size="sm" />
                                            Entrando...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-[1px] w-full bg-gray-300"></div>
                            <div className="flex-1 text-xs text-nowrap text-gray-500">
                                ou login com
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
