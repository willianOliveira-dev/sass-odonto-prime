"use client";
import Image from "next/image";
import Link from "next/link";
import fotoImg from "../../../../../public/foto1.png";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { _isoDuration } from "zod/v4/core";
import { Prisma } from "@prisma/client";

type UserWithSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
    };
}>;

type Professional = Omit<UserWithSubscription, "password">;

interface CardProfessionalProps {
    professional: Professional;
    delay: number;
}

interface ProfessionalsProps {
    professionals: Professional[];
}

const CardProfessional = ({ professional, delay }: CardProfessionalProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: delay * 0.1 }}
            viewport={{ once: true }}
        >
            <Card className="pt-0 overflow-hidden hover:scale-101 duration-300">
                <CardContent className="px-0">
                    <div className="relative h-48">
                        <Image
                            src={professional.image || fotoImg}
                            alt="Foto da Clinica"
                            className="object-cover"
                            fill
                            sizes="100%"
                        />
                        {professional.subscription?.status === "active" &&
                            professional.subscription.plan === "PREMIUM" && (
                                <div className="absolute top-2 right-2 rounded-2xl bg-gradient-to-l to-indigo-400 via-cyan-500 from-lime-500 text-white text-xs font-bold px-2 py-1">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>Premium</span>
                                    </div>
                                </div>
                            )}
                    </div>
                    <div className="p-4 space-y-2 min-h-[100px] max-h-[100px]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">
                                {professional.name}
                            </h3>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-gray-500 line-clamp-2 font-semibold">
                                {professional.address ||
                                    "Endereço não informado."}
                            </p>
                            <p className="text-xs text-gray-500">
                                {professional.times.length === 0
                                    ? "Sem horários disponíveis."
                                    : `Horários de atendimento: ${professional.times.at(
                                          0,
                                      )} até às ${professional.times.at(-1)}.`}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        asChild
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white"
                    >
                        <Link href={`/clinic/${professional.id}`}>
                            <span>Agender horário</span> <ArrowRight />{" "}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export function Professionals({ professionals }: ProfessionalsProps) {
    return (
        <section
            id="professionals"
            className="bg-gray-100 py-12 dark:bg-[#0d0d0d] md:py-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl text-center mb-12 font-bold">
                    Clinicas disponíveis
                </h2>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {professionals.map((professional, index) => (
                        <CardProfessional
                            professional={professional}
                            key={professional.id}
                            delay={index}
                        />
                    ))}
                </section>
            </div>
        </section>
    );
}
