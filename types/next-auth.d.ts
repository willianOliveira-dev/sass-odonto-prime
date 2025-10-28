import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface CustomUser {
    id: string;
    emailVerified?: Date | null;
    phone?: string | undefined;
    striperCustomerId?: string | null;
    times: string[];
    address?: string | null;
    timeZone: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

declare module 'next-auth' {
    /**
     * Estende o tipo padrão do User
     */
    interface User extends CustomUser {}

    /**
     * Estende o tipo padrão da Session
     */
    interface Session {
        user: CustomUser & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    /**
     * Estende o tipo padrão do JWT
     */
    interface JWT extends CustomUser {
        // O campo 'id' deve ser mapeado como 'sub' ou 'id' no token.
        id: string;
    }
}
