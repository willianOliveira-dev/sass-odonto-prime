'use server';

import { getInfoUser } from '../../_data-access-layer/getInfoUser';
import { ProfileContent } from '../_ProfileContent';

interface ProfileProps {
    userId: string;
}
export async function Profile({ userId }: ProfileProps) {
    
    const user = await getInfoUser({ userId });

    return <ProfileContent user={user!} />;
}
