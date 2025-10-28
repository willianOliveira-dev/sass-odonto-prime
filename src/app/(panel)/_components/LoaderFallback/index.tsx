'use client';

import Image from 'next/image';
import logoTooth from '../../../../../public/logo-tooth.png';

interface LoaderFallbackProps {
    size?: number;
    ringWidth?: number;
    text?: string;
}

export function LoaderFallback({
    size = 120,
    ringWidth = 6,
    text = 'Carregando...',
}: LoaderFallbackProps) {
    const ringSize = size;
    const innerLogoSize = Math.round(size * 0.56);
    const stroke = ringWidth;
    const radius = (ringSize - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="relative flex items-center justify-center"
                    style={{ width: ringSize, height: ringSize }}
                    role="img"
                    aria-label={text}
                >
                    <svg
                        width={ringSize}
                        height={ringSize}
                        viewBox={`0 0 ${ringSize} ${ringSize}`}
                        className="animate-rotate-smooth"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="grad" x1="0%" x2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke="#e6e9ef"
                            strokeWidth={stroke}
                        />

                        <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke="url(#grad)"
                            strokeWidth={stroke}
                            strokeDasharray={`${
                                circumference * 0.28
                            } ${circumference}`}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${ringSize / 2} ${
                                ringSize / 2
                            })`}
                            className="animate-spin-segment"
                        />
                    </svg>

                    <div
                        className="absolute flex items-center justify-center rounded-full shadow-md dark:shadow-black"
                        style={{ width: innerLogoSize, height: innerLogoSize }}
                    >
                        <Image
                            className="block w-10"
                            src={logoTooth}
                            alt="Logo Dente"
                            priority
                        />
                    </div>
                </div>

                <span className="text-sm text-gray-600">{text}</span>
            </div>

            {/* Extra: estilos CSS in-file para animações que não existem no Tailwind puro */}
            <style jsx>{`
                @keyframes rotateSmooth {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                @keyframes spinSegment {
                    0% {
                        transform: rotate(-90deg) translateZ(0);
                    }
                    100% {
                        transform: rotate(270deg) translateZ(0);
                    }
                }
                .animate-rotate-smooth {
                    animation: rotateSmooth 6s linear infinite;
                }
                .animate-spin-segment {
                    animation: spinSegment 1.4s cubic-bezier(0.4, 0, 0.2, 1)
                        infinite;
                    transform-origin: center center;
                }
            `}</style>
        </div>
    );
}
