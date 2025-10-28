"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { LoaderSpinner } from "@/components/ui/LoaderSpinner";
import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ForgotFormProps {
    handleVerificationEmail: () => Promise<void>;
    isSendingEmail: boolean;
    form: UseFormReturn<
        {
            email: string;
        },
        any,
        {
            email: string;
        }
    >;
}
export function ForgotForm({
    form,
    handleVerificationEmail,
    isSendingEmail,
}: ForgotFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={handleVerificationEmail} className="space-y-4">
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
                                    autoComplete="email"
                                    placeholder="Digite o e-mail cadastrado"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 hover:scale-101 cursor-pointer"
                >
                    {isSendingEmail ? (
                        <>
                            <LoaderSpinner size="sm" />
                            Verificando...
                        </>
                    ) : (
                        "Recuperar minha senha"
                    )}
                </Button>
            </form>
        </Form>
    );
}
