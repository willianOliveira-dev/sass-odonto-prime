'use client';
import Image from 'next/image';
import carousel1 from '../../../../../public/carousel-1.png';
import carousel2 from '../../../../../public/carousel-2.png';
import carousel3 from '../../../../../public/carousel-3.png';
import carousel4 from '../../../../../public/carousel-4.png';
import carousel5 from '../../../../../public/carousel-5.png';
import carousel6 from '../../../../../public/carousel-6.png';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
export function Clinic() {
    return (
        <section className="bg-white py-12 dark:bg-[#0a0a0a] md:py-16">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <main className="flex flex-col justify-center md:flex-row">
                    <motion.article
                        className="flex-2 max-w-2xl space-y-6 flex flex-col py-4 px-2 lg:px-0 lg:mr-10"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-blue-500 font-semibold text-sm uppercase">
                            A Clínica
                        </span>
                        <h2 className="text-2xl mb-4 font-bold">
                            Foco em oferecer tratamentos modernos em
                            dermatologia e odontologia
                        </h2>
                        <p className="text-base lg:text-lg dark:text-gray-400">
                            Somos uma rede de clínicas multidisciplinar, que
                            oferece tratamentos nas especialidades de
                            dermatologia e odontologia. Nosso foco é no cuidado
                            e na saúde de nossos(as) pacientes, mantendo
                            qualidade técnica e segurança.
                        </p>
                    </motion.article>
                    <Carousel className="w-full max-w-sm">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <CarouselContent>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className="aspect-square p-1">
                                            <Image
                                                src={carousel1}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className="aspect-square p-1">
                                            <Image
                                                src={carousel2}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className=" aspect-square p-1">
                                            <Image
                                                src={carousel3}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className=" aspect-square p-1">
                                            <Image
                                                src={carousel4}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className=" aspect-square p-1">
                                            <Image
                                                src={carousel5}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem className="relative">
                                    <Card className="p-0">
                                        <CardContent className=" aspect-square p-1">
                                            <Image
                                                src={carousel6}
                                                alt="Foto ilustrativa OdontoPrime"
                                                className="object-cover"
                                                quality={75}
                                                loading="lazy"
                                                fill
                                                sizes="100%"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            </CarouselContent>

                            <CarouselPrevious className="relative top-auto -bottom-10 left-5" />
                            <CarouselNext className="relative top-auto -bottom-10 left-15" />
                        </motion.div>
                    </Carousel>
                </main>
            </div>
        </section>
    );
}
