import prisma from '@/lib/prisma';

interface GetUserDataProps {
    userId: string;
}

export async function getInfoUser({ userId }: GetUserDataProps) {
    try {
        const user = await prisma.user.findFirst({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });

        if (!user) {
            return null;
        }

        const { password, ...userSafe } = user;

        return {
            ...userSafe,
            hasPassword: !!user.password,
        };
        
    } catch (error: unknown) {
        console.error(error);
        return null;
    }
}
