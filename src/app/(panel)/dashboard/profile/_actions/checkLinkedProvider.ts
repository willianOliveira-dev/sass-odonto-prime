'use server'; //server action
import { auth } from "@/lib/auth";
import { hasLinnkedProvider } from "../_data-access-layer/hasLinkedProvider";

export async function checkLinkeProvider() {
    const session = await auth();

    if (!session?.user.id) {
        return {
            error: 'Usuário não encontrado.',
        };
    }
    const { isLinked, provider } = await hasLinnkedProvider(session.user.id);

    return {
        isLinked,
        provider,
    };
}

