import React from 'react';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';

interface ButtonToggleThemesProps {
    isDarkMode: boolean;
    toggleThemes: () => void;
}

export function ButtonToggleThemes({
    isDarkMode,
    toggleThemes,
}: ButtonToggleThemesProps) {
    return (
        <button
            onClick={toggleThemes}
            className={clsx(
                'flex justify-center items-center w-18 h-8 rounded-full px-[8px] py-[6px] transition-all duration-300 overflow-hidden shadow-md',
                {
                    'bg-neutral-900': isDarkMode,
                    'bg-gray-200': !isDarkMode,
                }
            )}
        >
            <div
                className={clsx(
                    'relative flex justify-center items-center w-full h-full inset-shadow-sm rounded-full',
                    {
                        'inset-shadow-zinc-950':
                            isDarkMode,
                        'inset-shadow-gray-400':
                            !isDarkMode,
                    }
                )}
            >
                <span
                    className={clsx(
                        'absolute left-[2px] top-[2px] flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 transform shadow-sm',
                        {
                            'translate-x-[36px] bg-white text-gray-900 shadow-zinc-300 ':
                                isDarkMode,
                            'translate-x-0  bg-gray-900 text-white shadow-zinc-950':
                                !isDarkMode,
                        }
                    )}
                >
                    {isDarkMode ? <Moon className='size-full'/> : <Sun  className='size-full'/>}
                </span>
                <span
                    className={clsx(
                        'text-[9px] font-semibold transition-all duration-300',
                        {
                            'text-white mr-4': isDarkMode,
                            'text-gray-700 ml-4': !isDarkMode,
                        }
                    )}
                >
                    {isDarkMode ? 'DARK' : 'LIGHT'}
                </span>
            </div>
        </button>
    );
}
