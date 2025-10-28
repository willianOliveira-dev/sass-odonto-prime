'use server';
import getSession from '@/lib/getSession';
import { PlanDetailsProps } from '../plans';
import prisma from '@/lib/prisma';
import { canCreateService } from './canCreateService';
// Perguntar se você tem permissão para fazer algo...

type TypeCheck = 'service';

interface CanPermissionsProps {
    type: TypeCheck;
}

export type PlanProp =
    | 'BASIC'
    | 'PROFESSIONAL'
    | 'PREMIUM'
    | 'EXPIRED'
    | 'TRIAL';

export interface ResultPermissionProps {
    hasPermission: boolean;
    planId: PlanProp;
    expired: boolean;
    plan: PlanDetailsProps | null;
}

export async function canPermissions({
    type,
}: CanPermissionsProps): Promise<ResultPermissionProps> {
    const session = await getSession();

    if (!session?.user) {
        return {
            hasPermission: false,
            planId: 'EXPIRED',
            expired: true,
            plan: null,
        };
    }

    const userId = session.user.id;

    const subscription = await prisma.subscription.findUnique({
        where: {
            userId,
        },
    });

    switch (type) {
        case 'service':
            // verificar se esse usuário pode criar quantos serviços com base no plano dele...
            const permission = await canCreateService({
                subscription,
                session,
            });

            return permission;

        default:
            return {
                hasPermission: false,
                planId: 'EXPIRED',
                expired: true,
                plan: null,
            };
    }
}
