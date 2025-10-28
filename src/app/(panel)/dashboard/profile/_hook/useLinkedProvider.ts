'use client';

import { useEffect, useState } from 'react';

export function useLinkedProvider() {
    const [isLinked, setIsLinked] = useState<boolean>(true);
    const [provider, setProvider] = useState<string>('');

    useEffect(() => {
        async function fecthData() {
            const response = await fetch('/api/checked-linked-provider', {
                method: 'POST',
            });
            const data = await response.json();
            setIsLinked(data.isLinked);
            setProvider(data.provider);
        }
        fecthData();
    }, []);

    return { isLinked, provider };
}
