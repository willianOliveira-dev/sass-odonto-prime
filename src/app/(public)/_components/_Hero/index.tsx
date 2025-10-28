'use client';
import Image from 'next/image';
import doctorImage from '../../../../../public/doctor-hero.png';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="bg-gradient-to-r from-white to-gray-300 dark:bg-gradient-to-r dark:from-black dark:via-[#0a0a0a] dark:to-[#050a30]">
            <div className="container mx-auto px-4 pt-20 pb-4 sm:px-6 lg:px-8 lg:pb-0">
                <main className="flex items-center justify-center">
                    <motion.article
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-2 max-w-2xl space-y-6 flex flex-col justify-center py-6 px-2 lg:p-0"
                    >
                        <h1 className="text-4xl font-bold lg:text-5xl">
                            Encontre os{' '}
                            <span className="text-blue-500">
                                melhores profissionais
                            </span>{' '}
                            em um único local!
                        </h1>
                        <p className="text-base md:text-lg dark:text-gray-400">
                            Nós somos uma plataforma para profissionais da saúde
                            com foco em agilizar seu atendimento de forma
                            simplificada e organizada.
                        </p>
                        <Button className="bg-blue-500 hover:bg-blue-400 self-start">
                            Encontre uma clínica
                        </Button>
                    </motion.article>
                    <div className="hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src={doctorImage}
                                alt="Foto ilustrativa de um Profissional da Saúde"
                                quality={75}
                                className="w-[340px] h-[400px]object-contain"
                                priority
                            />
                        </motion.div>
                    </div>
                </main>
            </div>
        </section>
    );
}
