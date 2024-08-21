import { useEffect } from 'react';

export const useCarouselEffect = (radius: number, rotateSpeed: number, posts:any[]) => {
    useEffect(() => {
        let tX = 0, tY = 10;

        const odrag = document.getElementById('home-drag-container');
        const ospin = document.getElementById('home-spin-container');
        const aImg = Array.from(ospin?.getElementsByTagName('img') || []);

        const init = (time?: number) => {
            aImg.forEach((elem, i) => {
                elem.style.transform = `rotateY(${i * (360 / aImg.length)}deg) translateZ(${radius}px)`;
                elem.style.transition = 'transform 600ms';
            });
        };

        const applyTransform = (obj: HTMLElement) => {
            tY = Math.max(0, Math.min(tY, 180));
            obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
        };

        const handlePointerDown = (e: PointerEvent) => {
            clearInterval((odrag as any)?.timer);
            let sX = e.clientX, sY = e.clientY;
            let nX = 0, nY = 0, desX = 0, desY = 0;

            const handlePointerMove = (e: PointerEvent) => {
                nX = e.clientX;
                nY = e.clientY;
                desX = nX - sX;
                desY = nY - sY;
                tX += desX * 0.1;
                tY += desY * 0.1;
                applyTransform(odrag!);
                sX = nX;
                sY = nY;
            };

            const handlePointerUp = () => {
                (odrag as any).timer = setInterval(() => {
                    desX *= 0.95;
                    desY *= 0.95;
                    tX += desX * 0.1;
                    tY += desY * 0.1;
                    applyTransform(odrag!);

                }, 17);
                document.removeEventListener('pointermove', handlePointerMove);
                document.removeEventListener('pointerup', handlePointerUp);
            };

            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        };

        const handleWheel = (e: WheelEvent) => {
            const d = e.deltaY > 0 ? 50 : -50;
            radius += d;
            init(1);
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('wheel', handleWheel);

        const animationName = (rotateSpeed > 0 ? 'home-spin' : 'home-spinRevert');
        ospin?.style.setProperty('animation', `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`);

        init(1);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, [radius, rotateSpeed, posts]);
};
