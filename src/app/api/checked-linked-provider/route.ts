'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasLinnkedProvider } from '@/app/(panel)/dashboard/profile/_data-access-layer/hasLinkedProvider';
import { NextResponse } from 'next/server';

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({
            isLinked: false,
            provider: null,
        });
    }
    const { isLinked, provider } = await hasLinnkedProvider(session.user.id);

    return NextResponse.json({
        isLinked,
        provider,
    });
}
