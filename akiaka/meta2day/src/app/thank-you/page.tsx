'use client';
import React, { useEffect, useRef } from 'react';
import { particlesCursor } from 'threejs-toys';
import { Howl, Howler } from 'howler';

export default function Cursor() {
    const cursorRef = useRef<any>(null);
    const soundRef = useRef<Howl | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof window !== 'undefined' && cursorRef.current === null) {
                const pc = particlesCursor({
                    el: document.getElementById('effect'),
                    gpgpuSize: 250,
                    color: 0xDAA520,
                    colors: [0xDAA520, 0x800000],
                    coordScale: 3,
                    pointSize: 12,
                    noiseIntensity: 0.001,
                    noiseTimeCoef: 0.005,
                    pointDecay: 0.002,
                    sleepRadiusX: 500,
                    sleepRadiusY: 500,
                    sleepTimeCoefX: 0.005,
                    sleepTimeCoefY: 0.005,
                });

                cursorRef.current = pc;

                soundRef.current = new Howl({
                    src: ['/thanks.mp3'],
                    loop: true,
                    volume: 1.0,
                });

                const handleUserClick = () => {
                    if (soundRef.current && !soundRef.current.playing()) {
                        soundRef.current.play();
                    }

                    const h1 = document.querySelector('#effect p') as HTMLElement;
                    if (h1) {
                        pc.uniforms.uColor.value.set(Math.random() * 0xffffff);
                        pc.uniforms.uCoordScale.value = 0.005 + Math.random() * 2;
                        pc.uniforms.uNoiseIntensity.value = 0.0005 + Math.random() * 0.001;
                        pc.uniforms.uPointSize.value = 10 + Math.random() * 10;
                        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        const alpha1 = 1;
                        const alpha2 = 0.7;
                        const alpha3 = 0.5;

                        h1.style.textShadow =
                            `0 0 5px rgba(${parseInt(color.substring(1, 3), 16)}, ${parseInt(color.substring(3, 5), 16)}, ${parseInt(color.substring(5, 7), 16)}, ${alpha1}),
                             0 0 10px rgba(${parseInt(color.substring(1, 3), 16)}, ${parseInt(color.substring(3, 5), 16)}, ${parseInt(color.substring(5, 7), 16)}, ${alpha2}),
                             0 0 20px rgba(${parseInt(color.substring(1, 3), 16)}, ${parseInt(color.substring(3, 5), 16)}, ${parseInt(color.substring(5, 7), 16)}, ${alpha3})`;
                    }
                };

                document.body.addEventListener('click', handleUserClick);

                const interval = setInterval(() => {
                    handleUserClick();
                }, 750);

                return () => {
                    document.body.removeEventListener('click', handleUserClick);
                    clearInterval(interval); // Clear interval on component unmount
                    if (soundRef.current) {
                        soundRef.current.stop();
                    }
                    if (cursorRef.current) {
                        cursorRef.current.dispose();
                        cursorRef.current = null;
                    }
                };
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div>
            <div id="effect"
                 className="relative m-0 w-screen h-screen text-white font-sans text-center"
            >
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-handwriting text-4xl neon-text-normal">
                    Thank you!
                </p>
            </div>
        </div>
    );
}
