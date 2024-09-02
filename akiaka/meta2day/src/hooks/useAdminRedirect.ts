'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Swal from "sweetalert2";

export const useAdminRedirect = () => {
    const { isAdmin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAdmin) {
                Swal.fire({
                    title: 'Access Denied',
                    text: '지금은 관리자만 글을 등록할 수 있습니다.',
                    icon: 'warning',
                    confirmButtonText: '로그인 페이지로 이동'
                }).then(() => {
                    router.push('/login');
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isAdmin, pathname, router]);
};