interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ size = 'sm' }: LoadingDotsProps) {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-6 h-6',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <div
                className={`${sizes[size]} bg-gray-400 rounded-full animate-bounce`}
            />
            <div
                className={`${sizes[size]} bg-gray-500 rounded-full animate-bounce`}
                style={{ animationDelay: '0.1s' }}
            />
            <div
                className={`${sizes[size]} bg-gray-600 rounded-full animate-bounce`}
                style={{ animationDelay: '0.2s' }}
            />
        </div>
    );
}
