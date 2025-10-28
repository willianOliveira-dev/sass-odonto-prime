'use client';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react';

interface InputPasswordProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export function InputPassword({ password, setPassword }: InputPasswordProps) {
    const [openEye, setOpenEye] = useState<boolean>(false);
    return (
        <div className="relative">
            <Input
                id="password"
                type={openEye ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                placeholder="Digite sua senha"
                required
            />

            {openEye ? (
                <Eye
                    onClick={() => setOpenEye(!openEye)}
                    className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                />
            ) : (
                <EyeClosed
                    onClick={() => setOpenEye(!openEye)}
                    className="absolute top-1/2 -translate-y-1/2 right-1.5 text-gray-400"
                />
            )}
        </div>
    );
}
