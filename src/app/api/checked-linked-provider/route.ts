'use server';
import getSession from '@/lib/getSession';
import { hasLinnkedProvider } from '@/app/(panel)/dashboard/profile/_data-access-layer/hasLinkedProvider';
import { NextResponse } from 'next/server';

export async function POST() {
    const session = await getSession();

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
