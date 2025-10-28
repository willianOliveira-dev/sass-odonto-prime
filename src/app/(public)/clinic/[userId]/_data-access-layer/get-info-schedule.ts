'use server';
import prisma from '@/lib/prisma';

interface GetInfoScheduleProps {
    userId: string;
}

export async function getInfoSchedule({ userId }: GetInfoScheduleProps) {
    if (!userId) {
        return null;
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            include: {
                subscription: true,
                services: {
                    where: {
                        status: true,
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    } catch (error) {
        console.log(error);
        return null;
    }
}
