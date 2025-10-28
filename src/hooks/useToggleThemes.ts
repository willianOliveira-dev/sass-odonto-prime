import { useState, useEffect } from 'react';

export function useToggleThemes() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const saved: boolean = localStorage.getItem('theme') === 'dark';
        setIsDarkMode(saved);
        document.documentElement.classList.toggle('dark', saved);
    }, []);

    const toggleThemes = () => {
        const next: boolean = !isDarkMode;
        setIsDarkMode(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    return { isDarkMode, toggleThemes };
}
