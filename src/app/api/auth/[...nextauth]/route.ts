// app/api/auth/[...nextauth]/route.ts
'use server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const {
    handlers: { GET, POST },
} = NextAuth(authOptions);

export { GET, POST };
