'use server';
import prisma from '@/lib/prisma';

interface GetTimeClinicProps {
    userId: string;
}

export async function getTimesClinic({ userId }: GetTimeClinicProps) {
    if (!userId) {
        return {
            times: [],
            userId: '',
        };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                times: true,
                id: true,
            },
        });

        if (!user) {
            return {
                times: [],
                userId: '',
            };
        }

        return {
            times: user.times,
            userId,
        };
    } catch (error) {
        console.log(error);
        return {
            times: [],
            userId: '',
        };
    }
}
