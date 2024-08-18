'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthRedirect = () => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }
    }, [pathname, router]);
};
