export type PlanDetailsProps = {
    maxServices: number;
};

export type PlansProps = {
    BASIC: PlanDetailsProps;
    PROFESSIONAL: PlanDetailsProps;
    PREMIUM: PlanDetailsProps;
};

export const PLANS: PlansProps = {
    BASIC: {
        maxServices: 10,
    },
    PROFESSIONAL: {
        maxServices: 50,
    },
    PREMIUM: {
        maxServices: Infinity,
    },
};

export const PLANS_DATA = [
    {
        id: 'BASIC',
        name: 'Basic',
        description: 'Ideal para clínicas de pequeno porte.',
        oldPrice: '79,90',
        price: '19,90',
        highlight: false,
        background: 'bg-gradient-to-l to-blue-400 via-blue-600 from-sky-800',
        foreground:
            'bg-linear-to-l to-blue-400 via-blue-600 from-sky-800 bg-clip-text text-transparent',
        features: [
            `Até ${PLANS.BASIC.maxServices} serviços cadastrados.`,
            'Agendamentos ilimitados.',
            'Suporte padrão.',
            'Relatórios gerenciais.',
        ],
    },
    {
        id: 'PROFESSIONAL',
        name: 'Professional',
        description: 'Indicado para clínicas de médio e grande porte.',
        oldPrice: '149,90',
        price: '59,90',
        highlight: false,
        background:
            'bg-gradient-to-l to-amber-400 via-pink-500 from-indigo-800',
        foreground:
            'bg-linear-to-l to-amber-500 via-pink-600 from-indigo-800 bg-clip-text text-transparent',
        features: [
            `Até ${PLANS.PROFESSIONAL.maxServices} serviços cadastrados.`,
            'Agendamentos ilimitados.',
            'Suporte prioritário.',
            'Relatórios avançados.',
        ],
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        description:
            'Solução definitiva para clínicas que buscam o máximo desempenho.',
        oldPrice: '199,90',
        price: '99,90',
        background:
            'bg-gradient-to-l to-indigo-400 via-cyan-500 from-lime-500',
        foreground:
            'bg-linear-to-l to-indigo-400 via-cyan-500 from-lime-500 bg-clip-text text-transparent',
        highlight: true,
        features: [
            'Serviços ilimitados.',
            'Agendamentos ilimitados.',
            'Suporte dedicado e personalizado.',
            'Relatórios completos e inteligentes.',
            'Acesso antecipado a novos recursos.',
        ],
    },
];
