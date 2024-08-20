'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const HomePage: React.FC = () => {
    let radius = 400;
    let tX = 0, tY = 10;
    let rotateSpeed = -50;

    useEffect(() => {
        const odrag = document.getElementById('home-drag-container');
        const ospin = document.getElementById('home-spin-container');
        const aImg = Array.from(ospin?.getElementsByTagName('img') || []);

        const init = (time?: number) => {
            aImg.forEach((elem, i) => {
                elem.style.transform = `rotateY(${i * (360 / aImg.length)}deg) translateZ(${radius}px)`;
                elem.style.transition = 'transform 100ms';
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


            const animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
            ospin?.style.setProperty('animation', `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`);


        init(1);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="left-1/2 min-h-screen flex items-center justify-center bg-black">
            <div id="home-drag-container" className="relative w-full h-full">
                <div id="home-spin-container" className="relative w-[20vh] h-[30vh]">
                    <Image
                        src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Beautiful scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <Image
                        src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Another scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <Image
                        src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Beautiful scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <Image
                        src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Another scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <Image
                        src="https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Beautiful scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <Image
                        src="https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="Another scenery"
                        width={500}  // 지정할 이미지의 너비
                        height={300}  // 지정할 이미지의 높이
                    />
                    <p className="text-white absolute top-full left-1/2 transform -translate-x-1/2">
                        Recommanded by
                    </p>
                </div>
                <div id="home-ground" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"></div>
            </div>
        </div>
    );
};

export default HomePage;
