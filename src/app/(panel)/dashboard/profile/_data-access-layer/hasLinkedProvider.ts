import prisma from '@/lib/prisma';

export async function hasLinnkedProvider(userId: string) {
    try {
        const user = await prisma.account.findFirst({
            where: {
                userId: userId,
            },
        });
        if (!user) {
            return {
                isLinked: false,
                provider: null,
            };
        }
        return {
            isLinked: true,
            provider: user.provider,
        };
    } catch (error) {
        console.log(error);
        return {
            isLinked: false,
            provider: null,
        };
    }
}
