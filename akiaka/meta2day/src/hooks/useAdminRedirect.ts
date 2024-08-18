'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth'; // useAuth 훅을 사용

export const useAdminRedirect = () => {
    const { isAdmin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAdmin) {
                alert('지금은 관리자만 글을 등록할 수 있습니다.');
                router.push('/login');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isAdmin, pathname, router]);
};