export type RGBTuple = [number, number, number];
export type HSLTuple = [number, number, number];

export function rgbSmooth(iterations: number, smoothcolor: number): RGBTuple {
    const r = 0.6 + 0.4 * Math.sin(smoothcolor * 0.1 + iterations * 0.53);
    const g = r * r;
    const b = r * g;
    return [r, g, b];
}

export function rgbSmoothBernshtein(iterations: number, maxIter: number): RGBTuple {
    const t = (iterations / maxIter) * 1.0;
    const r = 4 * Math.pow(1 - t, 2) * Math.pow(t, 1);
    const g = 9 * Math.pow(1 - t, 2) * Math.pow(t, 2);
    const b = 11 * Math.pow(1 - t, 2) * Math.pow(t, 1);
    return [r, g, b];
}

export function iterationToRGB(iterations: number, maxIter: number, hueOffset: number): RGBTuple {
    if (iterations == maxIter) {
        return [0, 0, 0];
    }

    const h = (hueOffset + iterations) % 360;
    const s = 0.7;
    const l = 0.5;

    return hslToRgb([h, s, l]);
}

export function hslToRgb(hsl: HSLTuple): RGBTuple {
    const [h, s, l] = hsl;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    const [r, g, b] = getBaseRgb(h, c, x);
    return [r + m, g + m, b + m];
}

export function getBaseRgb(h: number, c: number, x: number): RGBTuple {
    if (h >= 0 && h < 60) {
        return [c, x, 0];
    }
    if (h >= 60 && h < 120) {
        return [x, c, 0];
    }
    if (h >= 120 && h < 180) {
        return [0, c, x];
    }
    if (h >= 180 && h < 240) {
        return [0, x, c];
    }
    if (h >= 240 && h < 300) {
        return [x, 0, c];
    }
    if (h >= 300 && h < 360) {
        return [c, 0, x];
    }
}
