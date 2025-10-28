import clsx from 'clsx';

export function LoaderSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'h-4 w-4 border-2 border-gray-300 border-t-gray-500',
        md: 'h-8 w-8 border-4 border-gray-300 border-t-gray-500',
        lg: 'h-16 w-16 border-4 border-gray-300 border-t-gray-500',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={clsx('animate-spin rounded-full ', {
                    [sizes[size] || sizes.md]: true,
                })}
            ></div>
        </div>
    );
}
