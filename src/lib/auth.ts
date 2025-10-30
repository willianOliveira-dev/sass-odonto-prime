import prisma from './prisma';
import bcrypt from 'bcryptjs';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type AuthOptions } from 'next-auth';

interface CredentialsType {
    email?: string;
    password?: string;
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers: [
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID!,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // @ts-ignore - Em execução vai funcionar
            async authorize(credentials) {
                const { email, password } = credentials as CredentialsType;

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Se for o primeiro login, use o objeto 'user'
            if (user) {
                token.sub = user.id;
                token.emailVerified = user.emailVerified;
                return token;
            }

            //  SE NÃO FOR O PRIMEIRO LOGIN:
            // Puxa o ID do token existente
            const userId = token.id || token.sub;

            if (userId) {
                const latestUser = await prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        emailVerified: true,
                    },
                });

                if (latestUser) {
                    token.emailVerified = latestUser.emailVerified;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub!;
                session.user.emailVerified = token.emailVerified!;
            }
            return session;
        },
    },
};
