declare module 'threejs-toys' {
    interface ParticlesCursorOptions {
        el: HTMLElement | null;
        gpgpuSize?: number;
        color?: number;
        colors?: number[];
        coordScale?: number;
        pointSize?: number;
        noiseIntensity?: number;
        noiseTimeCoef?: number;
        pointDecay?: number;
        sleepRadiusX?: number;
        sleepRadiusY?: number;
        sleepTimeCoefX?: number;
        sleepTimeCoefY?: number;
    }

    export function particlesCursor(options: ParticlesCursorOptions): any;
}